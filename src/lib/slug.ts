import { db } from "@/lib/db";

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug || "item";
}

type Table = "product" | "post" | "category";

async function existsIn(table: Table, slug: string, excludeId?: string): Promise<boolean> {
  const where = excludeId ? { slug, id: { not: excludeId } } : { slug };
  switch (table) {
    case "product":
      return !!(await db.product.findFirst({ where }));
    case "post":
      return !!(await db.post.findFirst({ where }));
    case "category":
      return !!(await db.category.findFirst({ where }));
  }
}

/** Generate a URL-safe slug that is guaranteed unique within the given table. */
export async function uniqueSlug(table: Table, base: string, excludeId?: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let counter = 2;
  while (await existsIn(table, candidate, excludeId)) {
    candidate = `${root}-${counter++}`;
  }
  return candidate;
}
