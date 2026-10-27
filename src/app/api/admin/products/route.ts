import { withAdmin, ok, fail, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { productSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

/** List products for the admin table (includes drafts, supports search + status filter). */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";

    const where = {
      ...(q ? { title: { contains: q } } : {}),
      ...(status === "PUBLISHED" || status === "DRAFT" ? { status } : {}),
    };

    const products = await db.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: { category: { select: { name: true, slug: true } } },
    });

    return ok({ products });
  });
}

/** Create a product. */
export async function POST(req: Request) {
  return withAdmin(req, async () => {
    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    const slug = data.slug?.trim() ? await uniqueSlug("product", data.slug) : await uniqueSlug("product", data.title);

    const product = await db.product.create({
      data: {
        title: data.title,
        slug,
        shortDescription: data.shortDescription ?? null,
        description: data.description,
        images: JSON.stringify(data.images),
        pinterestImage: data.pinterestImage ?? null,
        imageAlt: data.imageAlt ?? null,
        categoryId: data.categoryId ?? null,
        subcategory: data.subcategory ?? null,
        amazonUrl: data.amazonUrl,
        asin: data.asin ?? null,
        price: data.price ?? null,
        features: JSON.stringify(data.features),
        pros: JSON.stringify(data.pros),
        cons: JSON.stringify(data.cons),
        featured: data.featured,
        status: data.status,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return ok({ product });
  });
}
