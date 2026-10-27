import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { LegalShell, LegalSection } from "@/components/site/legal-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies this website uses (spoiler: barely any) and how to control them.",
  alternates: { canonical: "/cookie-policy" },
};

export default async function CookiePolicyPage() {
  const settings = await getSettings();

  return (
    <LegalShell
      title="Cookie Policy"
      updated="October 2026"
      intro={`Good news: ${settings.siteName} keeps cookies to an absolute minimum. This page explains the only cookie we set and why you won't see a cookie banner here.`}
    >
      <LegalSection title="The only cookie we set">
        <p>
          <strong>hh_admin_session</strong> — a strictly necessary, HTTP-only session cookie set when an
          administrator signs in to the dashboard. It contains a random session token (never your credentials),
          exists solely to keep that administrator logged in securely, and expires automatically after 7 days.
        </p>
        <p>
          As a regular visitor, this site sets <strong>no cookies at all</strong> in your browser.
        </p>
      </LegalSection>

      <LegalSection title="What we don't use">
        <ul className="list-disc space-y-2 pl-6">
          <li>No analytics or advertising cookies</li>
          <li>No cross-site tracking pixels</li>
          <li>No social media embed cookies</li>
          <li>No consent-storage cookies (there&apos;s nothing to consent to)</li>
        </ul>
        <p>
          That&apos;s why there is no cookie banner: we don&apos;t place non-essential cookies, so there&apos;s
          nothing requiring consent under GDPR or similar laws. Clicking an affiliate link takes you to Amazon,
          which operates its own cookies under its own policies.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can clear or block cookies in your browser settings at any time. Blocking or deleting our session
          cookie only affects one thing: an administrator would need to sign in again. Nothing on the public
          site requires cookies to function.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          If you have questions about this policy, contact us at{" "}
          <a href={`mailto:${settings.contactEmail}`} className="font-medium text-sage-deep underline">
            {settings.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
