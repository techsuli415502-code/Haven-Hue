import { withAdmin, ok, fail, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

/** Duplicate a product as a new draft (useful for similar listings). */
export async function POST(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const source = await db.product.findUnique({ where: { id } });
    if (!source) return notFound("Product");

    const slug = await uniqueSlug("product", `${source.slug}-copy`);

    const product = await db.product.create({
      data: {
        title: `${source.title} (Copy)`,
        slug,
        shortDescription: source.shortDescription,
        description: source.description,
        images: source.images,
        pinterestImage: source.pinterestImage,
        imageAlt: source.imageAlt,
        categoryId: source.categoryId,
        subcategory: source.subcategory,
        amazonUrl: source.amazonUrl,
        asin: source.asin,
        price: source.price,
        features: source.features,
        pros: source.pros,
        cons: source.cons,
        featured: false,
        status: "DRAFT",
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
      },
    });

    return ok({ product, message: `Duplicated as draft "${product.title}".` });
  });
}
