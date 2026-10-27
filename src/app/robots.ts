import type { MetadataRoute } from "next";
import { getSettings, siteBaseUrl } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = siteBaseUrl(settings);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/uploads/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
