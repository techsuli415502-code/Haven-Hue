import "server-only";
import { db } from "@/lib/db";
import {
  demoCategories,
  demoPublishedPosts,
  demoPublishedProducts,
  demoCategoryBySlug,
  demoPostBySlug,
  demoProductBySlug,
} from "@/lib/demo-data";
import type { Category, Post, Product } from "@prisma/client";

/**
 * Read path for PUBLIC site content with database outage protection.
 *
 * Every getter first tries the real database. If the database is not
 * configured yet (fresh Vercel project), unreachable, or errors for any
 * reason, the getter transparently falls back to the bundled demo snapshot
 * in `demo-data.ts`. Visitors always see a working shop; once a database is
 * connected, the real rows win automatically — no code change needed.
 *
 * Admin/API write paths deliberately do NOT use this module: editing content
 * requires a real database, and those surfaces surface the connection error.
 */

export async function tryDb<T>(query: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`[content] DB unavailable for ${label} — serving demo content:`, shortError(error));
    return fallback;
  }
}

export async function isDatabaseUp(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

function shortError(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  return text.replace(/\s+/g, " ").slice(0, 160);
}

type ProductWithCategory = Product & { category: Category | null };

/* ----------------------------- Header / footer ---------------------------- */

export function getFooterCategories() {
  return tryDb(
    () =>
      db.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { slug: true, name: true },
      }),
    demoCategories.map((c) => ({ slug: c.slug, name: c.name })),
    "footer categories",
  );
}

export function getShopCategories() {
  return getFooterCategories();
}

/* --------------------------------- Home ---------------------------------- */

export function getFeaturedCategories(take = 6) {
  return tryDb(
    () =>
      db.category.findMany({
        where: { featured: true },
        orderBy: [{ sortOrder: "asc" }],
        take,
        include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
      }),
    demoCategories.filter((c) => c.featured).slice(0, take),
    "featured categories",
  );
}

export function getAllCategoriesWithCounts() {
  return tryDb(
    () =>
      db.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
      }),
    demoCategories,
    "all categories",
  );
}

export function getHomeProducts() {
  return tryDb(
    async () => ({
      featured: await db.product.findMany({
        where: { status: "PUBLISHED", featured: true },
        orderBy: { updatedAt: "desc" },
        take: 4,
        include: { category: true },
      }),
      latest: await db.product.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 8,
        include: { category: true },
      }),
    }),
    {
      featured: demoPublishedProducts.filter((p) => p.featured).slice(0, 4),
      latest: demoPublishedProducts.slice(0, 8),
    },
    "home products",
  );
}

export function getLatestPosts(take = 3) {
  return tryDb(
    () =>
      db.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take,
      }),
    demoPublishedPosts.slice(0, take),
    "latest posts",
  );
}

/* --------------------------------- Shop ---------------------------------- */

export interface ShopQuery {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
  pageSize?: number;
}

export async function getShopProducts({ q, category, sort = "newest", page = "1", pageSize = 12 }: ShopQuery) {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category: { is: { slug: category } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { shortDescription: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "featured"
      ? [{ featured: "desc" as const }, { publishedAt: "desc" as const }]
      : sort === "title-asc"
        ? [{ title: "asc" as const }]
        : sort === "title-desc"
          ? [{ title: "desc" as const }]
          : [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];

  const dbResult = await tryDb(
    async () => ({
      totalCount: await db.product.count({ where }),
      products: (await db.product.findMany({
        where,
        orderBy,
        include: { category: true },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
      })) as ProductWithCategory[],
    }),
    null,
    "shop products",
  );

  if (dbResult) return dbResult;

  // Demo fallback: mirror the same filtering/sorting in plain JS.
  const needle = q?.toLowerCase();
  let items = demoPublishedProducts.filter((p) => {
    if (category && p.category?.slug !== category) return false;
    if (needle) {
      const hay = `${p.title}\n${p.shortDescription ?? ""}\n${p.description}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
  items = sortProducts(items, sort);
  return {
    totalCount: items.length,
    products: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  };
}

function sortProducts(items: ProductWithCategory[], sort: string): ProductWithCategory[] {
  const byTime = (a: ProductWithCategory, b: ProductWithCategory) =>
    (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
  switch (sort) {
    case "featured":
      return [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || byTime(a, b));
    case "title-asc":
      return [...items].sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return [...items].sort((a, b) => b.title.localeCompare(a.title));
    default:
      return [...items].sort(byTime);
  }
}

/* ------------------------------- Categories ------------------------------- */

export function getCategoryBySlug(slug: string) {
  return tryDb(() => db.category.findUnique({ where: { slug } }), demoCategoryBySlug(slug), `category ${slug}`);
}

export function getProductsByCategory(categoryId: string) {
  return tryDb(
    () =>
      db.product.findMany({
        where: { status: "PUBLISHED", categoryId },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        include: { category: true },
      }),
    demoPublishedProducts
      .filter((p) => p.categoryId === categoryId)
      .sort((a, b) => Number(b.featured) - Number(a.featured)),
    `products of category ${categoryId}`,
  );
}

export function getProductBySlug(slug: string) {
  return tryDb(
    () => db.product.findUnique({ where: { slug }, include: { category: true } }),
    demoProductBySlug(slug),
    `product ${slug}`,
  );
}

/* --------------------------------- Blog ---------------------------------- */

export async function getBlogPosts({ page = "1", tag, pageSize = 9 }: { page?: string; tag?: string; pageSize?: number }) {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(tag ? { tags: { contains: tag } } : {}),
  };

  const dbResult = await tryDb(
    async () => ({
      totalCount: await db.post.count({ where }),
      posts: await db.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
      }),
      popularTags: await popularTagsFromDb(),
    }),
    null,
    "blog posts",
  );

  if (dbResult) return dbResult;

  // Demo fallback in plain JS.
  const items = demoPublishedPosts.filter((p) => {
    if (!tag) return true;
    try {
      return (JSON.parse(p.tags) as unknown[]).some((t) => String(t) === tag);
    } catch {
      return false;
    }
  });
  return {
    totalCount: items.length,
    posts: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    popularTags: popularTagsFromList(demoPublishedPosts),
  };
}

async function popularTagsFromDb(): Promise<[string, number][]> {
  const published = await db.post.findMany({ where: { status: "PUBLISHED" }, select: { tags: true } });
  return popularTagsFromList(published);
}

function popularTagsFromList(posts: Pick<Post, "tags">[]): [string, number][] {
  const tagCounts = new Map<string, number>();
  for (const p of posts) {
    try {
      const tags = JSON.parse(p.tags);
      if (Array.isArray(tags)) {
        for (const t of tags) {
          const key = String(t);
          tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
        }
      }
    } catch {
      // ignore malformed tags
    }
  }
  return [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

export function getPostBySlug(slug: string) {
  return tryDb(() => db.post.findUnique({ where: { slug } }), demoPostBySlug(slug), `post ${slug}`);
}

export function getRelatedPosts(category: string, excludeId: string, take = 3) {
  return tryDb(
    () =>
      db.post.findMany({
        where: { status: "PUBLISHED", category, id: { not: excludeId } },
        take,
        orderBy: { publishedAt: "desc" },
      }),
    demoPublishedPosts.filter((p) => p.category === category && p.id !== excludeId).slice(0, take),
    `related posts for ${category}`,
  );
}

export function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return tryDb(
    () =>
      db.product.findMany({
        where: { status: "PUBLISHED", categoryId, id: { not: excludeId } },
        include: { category: true },
        take,
        orderBy: { publishedAt: "desc" },
      }),
    demoPublishedProducts.filter((p) => p.categoryId === categoryId && p.id !== excludeId).slice(0, take),
    `related products for ${categoryId}`,
  );
}

/* -------------------------------- Sitemap -------------------------------- */

export function getSitemapEntries() {
  return tryDb(
    async () => ({
      categories: await db.category.findMany({ select: { slug: true, updatedAt: true } }),
      products: await db.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      posts: await db.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    }),
    {
      categories: demoCategories.map((c) => ({ slug: c.slug, updatedAt: c.updatedAt })),
      products: demoPublishedProducts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })),
      posts: demoPublishedPosts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })),
    },
    "sitemap entries",
  );
}
