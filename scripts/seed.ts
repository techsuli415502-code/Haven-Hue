/**
 * Database seed script for Haven & Hue.
 * Run with: bun scripts/seed.ts
 *
 * Idempotent: existing entries (matched by slug/email) are skipped, so it is
 * safe to run repeatedly. The first admin account is created from the
 * ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD environment variables — these are
 * server-side only and never exposed to the frontend.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { seedCategories as categoryData, seedProducts as productData, IMG } from "./seed-data";
import { seedPosts as postData } from "./seed-posts";

const db = new PrismaClient();

async function seedSettings() {
  const existing = await db.setting.findUnique({ where: { id: "main" } });
  if (existing) {
    // Backfill fields that were left empty by an early auto-created row.
    if (!existing.heroImage) {
      await db.setting.update({
        where: { id: "main" },
        data: { heroImage: IMG("1616486338812-3dadae4b4ace", 1400) },
      });
      console.log("Settings: backfilled hero image.");
    } else {
      console.log("Settings: already present, skipping.");
    }
    return;
  }
  await db.setting.create({
    data: {
      id: "main",
      heroImage: IMG("1616486338812-3dadae4b4ace", 1400),
      siteDescription:
        "Discover hand-picked home decor, styling ideas, and cozy inspiration for every room.",
    },
  });
  console.log("Settings: created with default hero image.");
}

async function seedAdmin() {
  const count = await db.adminUser.count();
  if (count > 0) {
    console.log("Admin: already exists, skipping.");
    return;
  }
  const email = (process.env.ADMIN_EMAIL ?? "admin@havenhue.test").trim().toLowerCase();
  const name = (process.env.ADMIN_NAME ?? "Site Admin").trim();
  // Never hard-code a default password: if ADMIN_PASSWORD is not provided,
  // generate a strong random one and print it exactly once.
  const password =
    process.env.ADMIN_PASSWORD?.trim() ||
    `Hh-${crypto.randomBytes(9).toString("base64url")}-9x`;
  const passwordHash = await bcrypt.hash(password, 12);
  await db.adminUser.create({ data: { email, name, passwordHash } });
  if (process.env.ADMIN_PASSWORD?.trim()) {
    console.log(`Admin: created ${email} (from ADMIN_PASSWORD env — change the password after first login).`);
  } else {
    console.log(`Admin: created ${email}`);
    console.log(`Admin password (random, shown ONCE — store it now): ${password}`);
  }
}

async function seedCategories() {
  for (const c of categoryData) {
    const exists = await db.category.findUnique({ where: { slug: c.slug } });
    if (exists) continue;
    await db.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        imageAlt: c.imageAlt,
        featured: c.featured,
        sortOrder: c.sortOrder,
      },
    });
  }
  console.log(`Categories: ensured ${categoryData.length} entries.`);
}

async function seedProducts() {
  const categories = await db.category.findMany();
  const bySlug = new Map(categories.map((c) => [c.slug, c.id]));

  for (const p of productData) {
    const exists = await db.product.findUnique({ where: { slug: p.slug } });
    if (exists) continue;
    await db.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        images: JSON.stringify(p.images),
        imageAlt: p.imageAlt,
        categoryId: bySlug.get(p.categorySlug) ?? null,
        subcategory: p.subcategory ?? null,
        amazonUrl: p.amazonUrl,
        features: JSON.stringify(p.features),
        pros: JSON.stringify(p.pros),
        cons: JSON.stringify(p.cons),
        featured: p.featured,
        status: p.status,
        seoTitle: p.seoTitle ?? null,
        seoDescription: p.seoDescription ?? null,
        publishedAt: p.status === "PUBLISHED" ? new Date() : null,
      },
    });
  }
  console.log(`Products: ensured ${productData.length} entries (1 draft demo included).`);
}

async function seedPosts() {
  for (const p of postData) {
    const exists = await db.post.findUnique({ where: { slug: p.slug } });
    if (exists) continue;
    await db.post.create({
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        featuredImage: p.featuredImage,
        imageAlt: p.imageAlt,
        category: p.category,
        tags: JSON.stringify(p.tags),
        author: p.author,
        status: p.status,
        seoTitle: p.seoTitle ?? null,
        seoDescription: p.seoDescription ?? null,
        publishedAt: p.status === "PUBLISHED" ? new Date() : null,
      },
    });
  }
  console.log(`Posts: ensured ${postData.length} entries.`);
}

async function main() {
  await seedSettings();
  await seedAdmin();
  await seedCategories();
  await seedProducts();
  await seedPosts();
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
