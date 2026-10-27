import { withAdmin, ok, fail, zodMessage, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

/** List all categories (for admin management and pickers). */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    const categories = await db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return ok({ categories });
  });
}

/** Create a category. */
export async function POST(req: Request) {
  return withAdmin(req, async () => {
    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    const slug = data.slug?.trim() ? await uniqueSlug("category", data.slug) : await uniqueSlug("category", data.name);

    const category = await db.category.create({
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
