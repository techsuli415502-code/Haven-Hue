import { ExternalLink } from "lucide-react";
import { buildAffiliateUrl, affiliateRel } from "@/lib/affiliate";
import type { Product, SiteSettings } from "@/lib/types";

/**
 * The affiliate CTA used on product cards and product pages.
 * - Always points at the saved Amazon URL (with the configured tracking ID appended).
 * - rel attributes come from the admin's Affiliate Settings (program compliance).
 */
export function AffiliateButton({
  product,
  settings,
  className = "btn-sage w-full",
  label = "View on Amazon",
}: {
  product: Pick<Product, "amazonUrl">;
  settings: Pick<SiteSettings, "amazonTrackingId" | "affiliateRel" | "affiliateNewTab">;
  className?: string;
  label?: string;
}) {
  const href = buildAffiliateUrl(product.amazonUrl, settings.amazonTrackingId);
  return (
    <a
      href={href}
      target={settings.affiliateNewTab ? "_blank" : undefined}
      rel={affiliateRel(settings.affiliateRel)}
      className={className}
      aria-label={`${label} (opens Amazon in a new tab)`}
    >
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
