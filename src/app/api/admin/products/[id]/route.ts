import { withAdmin, ok, fail, notFound, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { productSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

/** Get a single product (including drafts) for editing. */
export async function GET(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const product = await db.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!product) return notFound("Product");
    return ok({ product });
  });
}

/** Update a product. */
export async function PUT(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return notFound("Product");

    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    // Re-slug only when the slug or title actually changed.
    let slug = existing.slug;
    const desiredBase = data.slug?.trim() || data.title;
    if (desiredBase !== existing.title && desiredBase !== existing.slug) {
      slug = await uniqueSlug("product", desiredBase, id);
    }

    const wasPublished = existing.status === "PUBLISHED";
    const publishedAt =
      data.status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : null;

    const product = await db.product.update({
      where: { id },
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
        publishedAt,
      },
    });

    return ok({ product });
  });
}

/** Delete a product permanently (the UI asks for confirmation first). */
export async function DELETE(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return notFound("Product");

    await db.product.delete({ where: { id } });
    return ok({ message: `Deleted "${existing.title}".` });
  });
}
