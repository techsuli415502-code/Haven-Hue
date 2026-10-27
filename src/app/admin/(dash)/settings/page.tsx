import { getSettings } from "@/lib/settings";
import { SettingsManager } from "@/components/admin/settings-manager";

export const metadata = { title: "Settings" };

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Website Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Branding, homepage content, SEO defaults, affiliate configuration and account security.
        </p>
      </header>
      <SettingsManager initial={settings} />
    </div>
  );
}
