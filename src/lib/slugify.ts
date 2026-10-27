/**
 * Client-safe slugifier (no database imports). Mirrors the server-side
 * slugify in @/lib/slug so URLs stay consistent between preview and save.
 */
export function slugifyClient(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug;
}
