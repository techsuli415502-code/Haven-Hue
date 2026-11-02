import Link from "next/link";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";
import type { SiteSettings } from "@/lib/types";
import type { Category } from "@/lib/types";

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

const EXPLORE_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/categories", label: "All Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

/**
 * Premium deep-sage footer — a grounded, editorial close to every page.
 * Cream typography on the brand's darkest green, with a warm sand thread
 * separating the legal strip.
 */
export function SiteFooter({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Pick<Category, "slug" | "name">[];
}) {
  return (
    <footer className="mt-auto bg-[#39412e] text-[#efeadb]">
      {/* warm thread echoing the header accent */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-[linear-gradient(90deg,var(--terracotta),var(--sand)_50%,var(--sage)_100%)] opacity-60"
      />
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo siteName={settings.siteName} logoUrl={settings.logoUrl} variant="light" />
            <p className="max-w-xs text-sm leading-6 text-[#efeadb]/70">{settings.footerText}</p>
            <SocialLinks settings={settings} variant="light" />
          </div>

          <nav aria-label="Explore">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#efeadb]/50">Explore</h2>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#efeadb]/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Popular categories">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#efeadb]/50">Categories</h2>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-sm text-[#efeadb]/75 transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#efeadb]/50">Legal</h2>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#efeadb]/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-5 text-[#efeadb]/55">
            {settings.affiliateDisclosure} Product availability and prices are handled by Amazon. This site does not
            sell products directly.
          </p>
          <p className="mt-3 text-xs text-[#efeadb]/55">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
