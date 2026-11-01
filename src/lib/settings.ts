import "server-only";
import type { Setting } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Site settings live in a single database row (id = "main").
 * They are editable from the admin dashboard and always read fresh from the DB,
 * so changes appear on the public site immediately without redeploying.
 *
 * If the database is unreachable or not yet provisioned (e.g. during a Vercel
 * build with a fresh project), we fall back to the schema defaults instead of
 * crashing the build — pages render with default branding and recover as soon
 * as the database is connected.
 */
export const DEFAULT_SETTINGS: Setting = {
  id: "main",
  siteName: "Haven & Hue",
  tagline: "Curated home decor finds & styling ideas",
  logoUrl: null,
  siteDescription:
    "Discover hand-picked home decor, styling ideas, and cozy inspiration for every room.",
  contactEmail: "hello@havenandhue.com",
  siteUrl: "",
  pinterestUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  xTwitterUrl: "",
  amazonTrackingId: "",
  affiliateRel: "sponsored nofollow noopener noreferrer",
  affiliateNewTab: true,
  affiliateDisclosure:
    "As an Amazon Associate I earn from qualifying purchases.",
  defaultSeoTitle: "Haven & Hue — Curated Home Decor Finds & Styling Ideas",
  defaultSeoDescription:
    "Hand-picked home decor finds, styling guides, and cozy inspiration for your living room, bedroom, and beyond.",
  footerText:
    "Honest decor finds and styling ideas to help you create a home you love.",
  heroHeading: "Discover Stylish Home Decor You'll Love",
  heroSubheading:
    "Hand-picked decor finds, styling ideas, and inspiration to turn every room into your favorite corner of home.",
  heroImage: "",
  newsletterEnabled: true,
  updatedAt: new Date(),
};

export async function getSettings(): Promise<Setting> {
  try {
    let settings = await db.setting.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await db.setting.create({ data: { id: "main" } });
    }
    return settings;
  } catch (err) {
    console.error(
      "[settings] database unavailable, serving default settings:",
      err instanceof Error ? err.message : err,
    );
    return DEFAULT_SETTINGS;
  }
}

/** Resolve the public base URL used for canonical URLs, sitemap and Open Graph. */
export function siteBaseUrl(settings: { siteUrl: string }): string {
  const fromSettings = settings.siteUrl.trim();
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  return (fromSettings || fromEnv || "http://localhost:3000").replace(/\/+$/, "");
}

/** Split an SEO title template: "%s | Site Name". */
export function seoTitle(title: string | null | undefined, settings: { defaultSeoTitle: string; siteName: string }): string {
  const t = title?.trim();
  if (t) return t;
  return settings.defaultSeoTitle || settings.siteName;
}
