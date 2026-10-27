"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";
import type { SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25";

interface SettingsForm {
  siteName: string;
  tagline: string;
  logoUrl: string;
  siteDescription: string;
  contactEmail: string;
  siteUrl: string;
  pinterestUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  xTwitterUrl: string;
  amazonTrackingId: string;
  affiliateRel: string;
  affiliateNewTab: boolean;
  affiliateDisclosure: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  footerText: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  newsletterEnabled: boolean;
}

function toForm(s: SiteSettings): SettingsForm {
  return {
    siteName: s.siteName,
    tagline: s.tagline,
    logoUrl: s.logoUrl ?? "",
    siteDescription: s.siteDescription,
    contactEmail: s.contactEmail,
    siteUrl: s.siteUrl,
    pinterestUrl: s.pinterestUrl,
    instagramUrl: s.instagramUrl,
    facebookUrl: s.facebookUrl,
    xTwitterUrl: s.xTwitterUrl,
    amazonTrackingId: s.amazonTrackingId,
    affiliateRel: s.affiliateRel,
    affiliateNewTab: s.affiliateNewTab,
    affiliateDisclosure: s.affiliateDisclosure,
    defaultSeoTitle: s.defaultSeoTitle,
    defaultSeoDescription: s.defaultSeoDescription,
    footerText: s.footerText,
    heroHeading: s.heroHeading,
    heroSubheading: s.heroSubheading,
    heroImage: s.heroImage,
    newsletterEnabled: s.newsletterEnabled,
  };
}

const TABS = [
  { id: "general", label: "General" },
  { id: "homepage", label: "Homepage" },
  { id: "seo", label: "SEO" },
  { id: "affiliate", label: "Affiliate" },
  { id: "security", label: "Security" },
] as const;

export function SettingsManager({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("general");
  const [form, setForm] = useState<SettingsForm>(toForm(initial));
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const set = <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Settings saved.");
        router.refresh();
      } else {
        toast.error(data.error ?? "Saving failed.");
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwSaving) return;
    if (pw.next !== pw.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Password updated.");
        setPw({ current: "", next: "", confirm: "" });
      } else {
        toast.error(data.error ?? "Password change failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setPwSaving(false);
    }
  };

  const Field = ({
    id,
    label,
    hint,
    children,
  }: {
    id: string;
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Settings sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-sage text-white" : "border border-border bg-card text-foreground/75 hover:border-sage",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "security" && (
        <form onSubmit={save} className="space-y-6">
          <button
            type="submit"
            disabled={saving}
            className="btn-sage sticky top-16 z-10 float-right px-5 py-2.5 text-xs"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Save className="h-3.5 w-3.5" aria-hidden="true" />}
            Save settings
          </button>

          {tab === "general" && (
            <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6" aria-labelledby="set-general">
              <h2 id="set-general" className="text-sm font-semibold">Site identity</h2>
              <Field id="s-name" label="Website name">
                <input id="s-name" type="text" value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className={inputClass} />
              </Field>
              <Field id="s-tagline" label="Tagline">
                <input id="s-tagline" type="text" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
              </Field>
              <Field id="s-logo" label="Logo image URL" hint="Leave empty to use the built-in monogram logo.">
                <input id="s-logo" type="text" value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} className={cn(inputClass, "font-mono text-xs")} />
              </Field>
              <Field id="s-desc" label="Site description">
                <textarea id="s-desc" rows={2} value={form.siteDescription} onChange={(e) => set("siteDescription", e.target.value)} className={inputClass} />
              </Field>
              <Field id="s-email" label="Contact email" hint="Shown on the contact page and used for form notifications if email is configured.">
                <input id="s-email" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputClass} />
              </Field>
              <Field id="s-footer" label="Footer text">
                <textarea id="s-footer" rows={2} value={form.footerText} onChange={(e) => set("footerText", e.target.value)} className={inputClass} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="s-pin" label="Pinterest profile URL">
                  <input id="s-pin" type="url" value={form.pinterestUrl} onChange={(e) => set("pinterestUrl", e.target.value)} placeholder="https://www.pinterest.com/yourprofile" className={inputClass} />
                </Field>
                <Field id="s-ig" label="Instagram URL">
                  <input id="s-ig" type="url" value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inputClass} />
                </Field>
                <Field id="s-fb" label="Facebook URL">
                  <input id="s-fb" type="url" value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} className={inputClass} />
                </Field>
                <Field id="s-x" label="X (Twitter) URL">
                  <input id="s-x" type="url" value={form.xTwitterUrl} onChange={(e) => set("xTwitterUrl", e.target.value)} className={inputClass} />
                </Field>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" checked={form.newsletterEnabled} onChange={(e) => set("newsletterEnabled", e.target.checked)} className="mt-0.5 accent-[var(--sage)]" />
                <span>
                  <span className="block text-sm font-medium">Show newsletter signup</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Signups are stored in your database and visible under Inbox → Subscribers. Connect an email service later to actually send campaigns.
                  </span>
                </span>
              </label>
            </section>
          )}

          {tab === "homepage" && (
            <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6" aria-labelledby="set-home">
              <h2 id="set-home" className="text-sm font-semibold">Homepage hero</h2>
              <Field id="s-hero-h" label="Hero heading">
                <input id="s-hero-h" type="text" value={form.heroHeading} onChange={(e) => set("heroHeading", e.target.value)} className={cn(inputClass, "text-lg")} />
              </Field>
              <Field id="s-hero-s" label="Hero subheading">
                <textarea id="s-hero-s" rows={3} value={form.heroSubheading} onChange={(e) => set("heroSubheading", e.target.value)} className={inputClass} />
              </Field>
              <Field id="s-hero-i" label="Hero image URL" hint="A wide (4:3 or 16:10) bright interior photo works best.">
                <input id="s-hero-i" type="text" value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} className={cn(inputClass, "font-mono text-xs")} />
              </Field>
              {form.heroImage && (
                <span className="relative block aspect-[16/10] overflow-hidden rounded-lg border border-border bg-secondary">
                  <SmartImage src={form.heroImage} alt="Hero image preview" sizes="640px" />
                </span>
              )}
              <p className="text-xs leading-5 text-muted-foreground">
                Featured categories are managed on the Categories page (star icon), and featured products with the
                “Featured” toggle on each product.
              </p>
            </section>
          )}

          {tab === "seo" && (
            <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6" aria-labelledby="set-seo">
              <h2 id="set-seo" className="text-sm font-semibold">Default SEO</h2>
              <Field id="s-siteurl" label="Site URL" hint="Your production domain, e.g. https://www.yoursite.com — used for canonical URLs, sitemap and social previews.">
                <input id="s-siteurl" type="url" value={form.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} placeholder="https://www.yoursite.com" className={inputClass} />
              </Field>
              <Field id="s-seotitle" label="Default SEO title" hint="Used on the homepage and as a fallback sitewide. Keep under 60 characters.">
                <input id="s-seotitle" type="text" value={form.defaultSeoTitle} onChange={(e) => set("defaultSeoTitle", e.target.value)} className={inputClass} />
              </Field>
              <Field id="s-seodesc" label="Default meta description" hint="Keep under 160 characters.">
                <textarea id="s-seodesc" rows={3} value={form.defaultSeoDescription} onChange={(e) => set("defaultSeoDescription", e.target.value)} className={inputClass} />
              </Field>
            </section>
          )}

          {tab === "affiliate" && (
            <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6" aria-labelledby="set-aff">
              <h2 id="set-aff" className="text-sm font-semibold">Amazon Associates</h2>
              <Field id="s-tag" label="Associates tracking ID" hint="e.g. yourstore-20. Automatically appended as the “tag” parameter to every affiliate link that doesn't already include one.">
                <input id="s-tag" type="text" value={form.amazonTrackingId} onChange={(e) => set("amazonTrackingId", e.target.value)} placeholder="yourstore-20" className={cn(inputClass, "font-mono text-xs")} />
              </Field>
              <Field id="s-rel" label="Affiliate link rel attributes" hint="Applied to every affiliate link. “sponsored nofollow noopener noreferrer” satisfies current program requirements.">
                <input id="s-rel" type="text" value={form.affiliateRel} onChange={(e) => set("affiliateRel", e.target.value)} className={cn(inputClass, "font-mono text-xs")} />
              </Field>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" checked={form.affiliateNewTab} onChange={(e) => set("affiliateNewTab", e.target.checked)} className="mt-0.5 accent-[var(--sage)]" />
                <span>
                  <span className="block text-sm font-medium">Open affiliate links in a new tab</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">Recommended so visitors don't leave your site.</span>
                </span>
              </label>
              <Field id="s-disc" label="Affiliate disclosure sentence" hint="Shown near affiliate content, in the footer, and on the disclosure page's opening line.">
                <textarea id="s-disc" rows={2} value={form.affiliateDisclosure} onChange={(e) => set("affiliateDisclosure", e.target.value)} className={inputClass} />
              </Field>
            </section>
          )}
        </form>
      )}

      {tab === "security" && (
        <form onSubmit={changePassword} className="max-w-md space-y-4 rounded-xl border border-border bg-card p-6" aria-labelledby="set-sec">
          <h2 id="set-sec" className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-sage" aria-hidden="true" />
            Change your password
          </h2>
          <div className="space-y-1.5">
            <label htmlFor="pw-current" className="text-sm font-medium">Current password</label>
            <input id="pw-current" type="password" required autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pw-next" className="text-sm font-medium">New password <span className="text-xs text-muted-foreground">(min. 8 characters)</span></label>
            <input id="pw-next" type="password" required minLength={8} autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pw-confirm" className="text-sm font-medium">Confirm new password</label>
            <input id="pw-confirm" type="password" required minLength={8} autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputClass} />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Changing your password signs out every other device and browser.
          </p>
          <button type="submit" disabled={pwSaving} className="btn-sage w-full py-2.5 text-xs">
            {pwSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
            Update password
          </button>
        </form>
      )}
    </div>
  );
}
