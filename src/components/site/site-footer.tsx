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

export function SiteFooter({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Pick<Category, "slug" | "name">[];
}) {
  return (
    <footer className="mt-auto border-t border-border bg-sand">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo siteName={settings.siteName} logoUrl={settings.logoUrl} />
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">{settings.footerText}</p>
            <SocialLinks settings={settings} />
          </div>

          <nav aria-label="Explore">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/70">Explore</h2>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-sage-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Popular categories">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/70">Categories</h2>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-sage-deep">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/70">Legal</h2>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-sage-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-border/70 pt-6">
          <p className="text-xs leading-5 text-muted-foreground">
            {settings.affiliateDisclosure} Product availability and prices are handled by Amazon. This site does not
            sell products directly.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
