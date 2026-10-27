import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { LegalShell, LegalSection } from "@/components/site/legal-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this website collects, uses and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <LegalShell
      title="Privacy Policy"
      updated="October 2026"
      intro={`This Privacy Policy explains what information ${settings.siteName} collects when you visit, how it is used, and the choices you have. We keep this page in plain language because privacy policies should be readable.`}
    >
      <LegalSection title="Who we are">
        <p>
          {settings.siteName} is a home decor inspiration and product discovery website. We feature products sold
          on Amazon and earn commissions when readers purchase through our links. If you have questions about
          this policy, contact us at{" "}
          <a href={`mailto:${settings.contactEmail}`} className="font-medium text-sage-deep underline">
            {settings.contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>We deliberately keep data collection minimal:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Newsletter subscriptions.</strong> If you subscribe, we store the email address you provide so
            we can send you decor ideas and updates.
          </li>
          <li>
            <strong>Contact form messages.</strong> If you contact us, we store your name, email address, subject
            and message so we can read and reply to your inquiry.
          </li>
          <li>
            <strong>Admin session cookies.</strong> The site sets a strictly necessary, HTTP-only session cookie
            only for signed-in administrators. Regular visitors receive no tracking cookies from us.
          </li>
        </ul>
        <p>We do not collect billing information, home addresses or account passwords from visitors — the site has no public accounts or checkout.</p>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          When you click an affiliate link, you leave our site and interact directly with Amazon. Amazon has its
          own privacy policy, cookies and tracking, which we do not control. We may also embed links to social
          platforms such as Pinterest; interacting with those services is subject to their respective policies.
        </p>
      </LegalSection>

      <LegalSection title="How we use your information">
        <p>
          We use stored emails only to send the newsletter you requested, and contact form submissions only to
          respond to your message. We do not sell, rent or trade your personal information to anyone. We do not
          build advertising profiles from your visits.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can unsubscribe from the newsletter at any time using the unsubscribe link in any email, or by
          emailing us. You may also request that we delete any personal information you have shared with us by
          emailing{" "}
          <a href={`mailto:${settings.contactEmail}`} className="font-medium text-sage-deep underline">
            {settings.contactEmail}
          </a>{" "}
          — we will honor reasonable requests promptly.
        </p>
      </LegalSection>

      <LegalSection title="Children's privacy">
        <p>
          This site is intended for a general adult audience and we do not knowingly collect information from
          children under 13. If you believe a child has provided us personal information, please contact us so we
          can remove it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If we update this policy, the revised version will be posted on this page with a new &ldquo;last
          updated&rdquo; date. Continued use of the site after changes means you accept the updated policy.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
