import { withAdmin, ok, fail, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { settingsSchema } from "@/lib/validators";

/** Get site settings. */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    let settings = await db.setting.findUnique({ where: { id: "main" } });
    if (!settings) settings = await db.setting.create({ data: { id: "main" } });
    return ok({ settings });
  });
}

/** Update site settings (site identity, homepage, SEO, affiliate configuration). */
export async function PUT(req: Request) {
  return withAdmin(req, async () => {
    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    const settings = await db.setting.upsert({
      where: { id: "main" },
      update: {
        siteName: data.siteName,
        tagline: data.tagline,
        logoUrl: data.logoUrl ?? null,
        siteDescription: data.siteDescription,
        contactEmail: data.contactEmail,
        siteUrl: data.siteUrl ?? "",
        pinterestUrl: data.pinterestUrl ?? "",
        instagramUrl: data.instagramUrl ?? "",
        facebookUrl: data.facebookUrl ?? "",
        xTwitterUrl: data.xTwitterUrl ?? "",
        amazonTrackingId: data.amazonTrackingId,
        affiliateRel: data.affiliateRel,
        affiliateNewTab: data.affiliateNewTab,
        affiliateDisclosure: data.affiliateDisclosure,
        defaultSeoTitle: data.defaultSeoTitle,
        defaultSeoDescription: data.defaultSeoDescription,
        footerText: data.footerText,
        heroHeading: data.heroHeading,
        heroSubheading: data.heroSubheading,
        heroImage: data.heroImage ?? "",
        newsletterEnabled: data.newsletterEnabled,
      },
      create: { id: "main", ...data, logoUrl: data.logoUrl ?? null, siteUrl: data.siteUrl ?? "" },
    });

    return ok({ settings, message: "Settings saved. The public site is updated immediately." });
  });
}
