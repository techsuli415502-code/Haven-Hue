import { z } from "zod";

/**
 * Zod validation schemas. Every admin mutation and public form submission is
 * validated and sanitized on the server before touching the database.
 */

const trimmed = (max: number) => z.string().trim().max(max);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Email is required.").max(200),
  password: z.string().min(1, "Password is required.").max(128),
});

export const setupSchema = z.object({
  name: trimmed(100).min(2, "Name must be at least 2 characters."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be at most 128 characters."),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required.").max(128),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .max(128, "New password must be at most 128 characters."),
});

const urlish = z
  .preprocess((v) => (v == null ? "" : v), z.string().trim().max(2000))
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Must start with http:// or https://")
  .transform((v) => (v === "" ? undefined : v));

const optionalImage = z
  .preprocess((v) => (v == null ? "" : v), z.string().trim().max(2000))
  .refine(
    (v) => v === "" || /^https?:\/\//i.test(v) || v.startsWith("/uploads/"),
    "Enter a valid image URL or upload a file.",
  )
  .transform((v) => (v === "" ? undefined : v));

/** Optional text: accepts undefined/null, trims, maps empty string to undefined. */
const optionalText = (max: number) =>
  z
    .preprocess((v) => (v == null ? "" : v), z.string().trim().max(max))
    .transform((v) => (v === "" ? undefined : v));

/** Amazon affiliate URL: must be a real http(s) URL on an Amazon domain. */
const amazonUrl = z
  .string()
  .trim()
  .min(1, "Amazon affiliate URL is required.")
  .max(2000)
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return (u.protocol === "https:" || u.protocol === "http:") && /(^|\.)amazon\.[a-z.]+$|^amzn\.to$/.test(u.hostname);
      } catch {
        return false;
      }
    },
    "Enter a valid Amazon URL (e.g. https://www.amazon.com/...).",
  );

const stringList = (maxItems: number, maxLen: number) =>
  z.array(z.string().trim().max(maxLen)).max(maxItems).transform((arr) => arr.filter((s) => s.length > 0));

export const productSchema = z.object({
  title: trimmed(200).min(3, "Product title must be at least 3 characters."),
  slug: optionalText(200),
  shortDescription: optionalText(300),
  description: trimmed(20000).default(""),
  images: stringList(8, 2000).default([]),
  pinterestImage: optionalImage,
  imageAlt: optionalText(300),
  categoryId: z.string().trim().max(100).optional().transform((v) => (v === "" ? null : v)),
  subcategory: optionalText(100),
  amazonUrl,
  asin: z
    .preprocess((v) => (v == null ? "" : v), z.string().trim().max(10))
    .refine((v) => v === "" || /^[A-Z0-9]{10}$/i.test(v), "ASIN must be 10 letters/numbers.")
    .transform((v) => (v === "" ? undefined : v)),
  price: optionalText(40),
  features: stringList(12, 300).default([]),
  pros: stringList(8, 300).default([]),
  cons: stringList(8, 300).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  seoTitle: optionalText(200),
  seoDescription: optionalText(320),
});

export type ProductInput = z.infer<typeof productSchema>;

export const postSchema = z.object({
  title: trimmed(200).min(3, "Post title must be at least 3 characters."),
  slug: optionalText(200),
  excerpt: trimmed(500).default(""),
  content: trimmed(80000).default(""),
  featuredImage: optionalImage,
  imageAlt: optionalText(300),
  pinterestImage: optionalImage,
  category: trimmed(80).default("Decor Ideas"),
  tags: stringList(15, 60).default([]),
  author: trimmed(100).default("Editorial Team"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  seoTitle: optionalText(200),
  seoDescription: optionalText(320),
});

export type PostInput = z.infer<typeof postSchema>;

export const categorySchema = z.object({
  name: trimmed(80).min(2, "Category name must be at least 2 characters."),
  slug: optionalText(100),
  description: optionalText(1000),
  image: optionalImage,
  imageAlt: optionalText(300),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

const optionalUrl = urlish;

export const settingsSchema = z.object({
  siteName: trimmed(100).min(1, "Site name is required."),
  tagline: trimmed(200).default(""),
  logoUrl: optionalImage,
  siteDescription: trimmed(500).default(""),
  contactEmail: z.string().trim().toLowerCase().email("Enter a valid contact email.").max(200),
  siteUrl: optionalUrl,
  pinterestUrl: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  xTwitterUrl: optionalUrl,
  amazonTrackingId: trimmed(100).default(""),
  affiliateRel: trimmed(200).default("sponsored nofollow noopener noreferrer"),
  affiliateNewTab: z.boolean().default(true),
  affiliateDisclosure: trimmed(500).default("As an Amazon Associate I earn from qualifying purchases."),
  defaultSeoTitle: trimmed(200).default(""),
  defaultSeoDescription: trimmed(320).default(""),
  footerText: trimmed(500).default(""),
  heroHeading: trimmed(200).default(""),
  heroSubheading: trimmed(500).default(""),
  heroImage: optionalImage,
  newsletterEnabled: z.boolean().default(true),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const contactSchema = z.object({
  name: trimmed(100).min(2, "Please enter your name."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
  subject: trimmed(150).min(3, "Please add a short subject."),
  message: trimmed(3000).min(10, "Please write a message of at least 10 characters."),
  // Honeypot — must stay empty; humans never see this field.
  website: z.string().max(0).optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
});
