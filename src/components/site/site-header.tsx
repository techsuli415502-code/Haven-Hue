import { SiteNav } from "./site-nav";
import { Logo } from "./logo";
import type { SiteSettings } from "@/lib/types";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      {/* Brand accent: a thin sage→terracotta→sand thread along the top edge */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full bg-[linear-gradient(90deg,var(--sage-deep),var(--sage)_30%,var(--sand)_55%,var(--terracotta)_100%)] opacity-80"
      />
      <div className="container-page relative flex h-16 items-center justify-between gap-4">
        <Logo siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <SiteNav />
      </div>
    </header>
  );
}
