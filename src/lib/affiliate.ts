/**
 * Amazon Associates helpers.
 *
 * Compliance notes:
 * - Affiliate URLs are stored per product in the database and fully under the
 *   administrator's control — nothing is scraped or invented.
 * - If an Associates tracking ID is configured in Settings, it is appended as
 *   the `tag` parameter to links that do not already carry one.
 * - Links are rendered with a configurable `rel` attribute
 *   (default: "sponsored nofollow noopener noreferrer") per program requirements.
 */
export function buildAffiliateUrl(url: string, trackingId?: string | null): string {
  const trimmed = url?.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    const tag = trackingId?.trim();
    if (tag && !parsed.searchParams.has("tag")) {
      parsed.searchParams.set("tag", tag);
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

export function affiliateRel(relSetting: string): string {
  const rel = relSetting?.trim();
  return rel || "sponsored nofollow noopener noreferrer";
}
