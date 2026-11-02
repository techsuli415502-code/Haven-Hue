import "server-only";
import { seedCategories, seedProducts } from "../../scripts/seed-data";
import { seedPosts } from "../../scripts/seed-posts";
import type { Category, Post, Product } from "@prisma/client";

/**
 * Demo content snapshot.
 *
 * When the site database is not connected yet (fresh Vercel project before
 * "Storage → Create Database" has been clicked), public pages still need
 * something real to render. This module shapes the seed catalog into
 * Prisma-model-shaped objects so the data-access layer in `content.ts` can
 * serve it as a read-only fallback. It is ONLY used when a database query
 * fails — once a database is connected the real rows always win.
 */

// Stable fake timestamps: newest first in seed order, spaced one minute apart
// so `publishedAt desc` ordering matches the seed array order exactly.
const BASE_TIME = new Date("2026-01-01T09:00:00.000Z").getTime();
const stamped = (i: number) => new Date(BASE_TIME - i * 60_000);

type DemoCategory = Category & { _count: { products: number } };
type DemoProduct = Product & { category: Category | null };

const demoCategoriesRaw: Category[] = seedCategories.map((c, i) => ({
  id: `demo-cat-${c.slug}`,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  imageAlt: c.imageAlt,
  featured: c.featured,
  sortOrder: c.sortOrder,
  createdAt: stamped(seedCategories.length - i),
  updatedAt: stamped(seedCategories.length - i),
}));

const categoryBySlug = new Map(demoCategoriesRaw.map((c) => [c.slug, c]));

const allDemoProducts: DemoProduct[] = seedProducts.map((p, i) => {
  const category = categoryBySlug.get(p.categorySlug) ?? null;
  return {
    id: `demo-prod-${p.slug}`,
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    images: JSON.stringify(p.images),
    pinterestImage: null,
    imageAlt: p.imageAlt,
    categoryId: category?.id ?? null,
    category,
    subcategory: p.subcategory ?? null,
    amazonUrl: p.amazonUrl,
    asin: p.asin ?? null,
    price: null,
    features: JSON.stringify(p.features),
    pros: JSON.stringify(p.pros),
    cons: JSON.stringify(p.cons),
    featured: p.featured,
    status: p.status,
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    createdAt: stamped(seedProducts.length - i),
    updatedAt: stamped(seedProducts.length - i),
    publishedAt: p.status === "PUBLISHED" ? stamped(seedProducts.length - i) : null,
  };
});

const allDemoPosts: Post[] = seedPosts.map((p, i) => ({
  id: `demo-post-${p.slug}`,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  content: p.content,
  featuredImage: p.featuredImage,
  imageAlt: p.imageAlt,
  pinterestImage: null,
  category: p.category,
  tags: JSON.stringify(p.tags),
  author: p.author,
  status: p.status,
  seoTitle: p.seoTitle ?? null,
  seoDescription: p.seoDescription ?? null,
  createdAt: stamped(seedPosts.length - i),
  updatedAt: stamped(seedPosts.length - i),
  publishedAt: p.status === "PUBLISHED" ? stamped(seedPosts.length - i) : null,
}));

// Categories get a `_count` matching how the pages query them.
export const demoCategories: DemoCategory[] = demoCategoriesRaw.map((c) => ({
  ...c,
  _count: { products: allDemoProducts.filter((p) => p.categoryId === c.id && p.status === "PUBLISHED").length },
}));

export const demoPublishedProducts: DemoProduct[] = allDemoProducts
  .filter((p) => p.status === "PUBLISHED")
  .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));

export const demoPublishedPosts: Post[] = allDemoPosts
  .filter((p) => p.status === "PUBLISHED")
  .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));

export function demoProductBySlug(slug: string): DemoProduct | null {
  return allDemoProducts.find((p) => p.slug === slug) ?? null;
}

export function demoPostBySlug(slug: string): Post | null {
  return allDemoPosts.find((p) => p.slug === slug) ?? null;
}

export function demoCategoryBySlug(slug: string): Category | null {
  return demoCategoriesRaw.find((c) => c.slug === slug) ?? null;
}
