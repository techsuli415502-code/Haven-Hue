import { withAdmin, ok, fail, zodMessage, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

/** Update a category. */
export async function PUT(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return notFound("Category");

    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    let slug = existing.slug;
    const desiredBase = data.slug?.trim() || data.name;
    if (desiredBase !== existing.name && desiredBase !== existing.slug) {
      slug = await uniqueSlug("category", desiredBase, id);
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
        imageAlt: data.imageAlt ?? null,
        featured: data.featured,
        sortOrder: data.sortOrder,
      },
    });

    return ok({ category });
  });
}

/** Delete a category. Products in it keep existing (category is detached). */
export async function DELETE(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return notFound("Category");

    await db.category.delete({ where: { id } });
    return ok({ message: `Deleted category "${existing.name}". Products in it were kept and unassigned.` });
  });
}
