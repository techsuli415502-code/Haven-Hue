import "server-only";
import { db } from "@/lib/db";

/**
 * Site settings live in a single database row (id = "main").
 * They are editable from the admin dashboard and always read fresh from the DB,
 * so changes appear on the public site immediately without redeploying.
 */
export async function getSettings() {
  let settings = await db.setting.findUnique({ where: { id: "main" } });
  if (!settings) {
    settings = await db.setting.create({ data: { id: "main" } });
  }
  return settings;
}

export type SiteSettings = Awaited<ReturnType<typeof getSettings>>;

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
