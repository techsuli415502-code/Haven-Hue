import { SiteNav } from "./site-nav";
import { Logo } from "./logo";
import type { SiteSettings } from "@/lib/types";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container-page relative flex h-16 items-center justify-between gap-4">
        <Logo siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <SiteNav />
      </div>
    </header>
  );
}
