import { getSettings } from "@/lib/settings";
import { getFooterCategories } from "@/lib/content";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const categories = await getFooterCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sage focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <SiteHeader settings={settings} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </div>
  );
}
