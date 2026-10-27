import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { LegalShell, LegalSection } from "@/components/site/legal-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms that govern your use of this website.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <LegalShell
      title="Terms and Conditions"
      updated="October 2026"
      intro={`Welcome to ${settings.siteName}. By using this website you agree to these Terms. They're short, readable, and written to protect both you and us.`}
    >
      <LegalSection title="The short version">
        <p>
          This is an inspiration and product-discovery website. We feature decor finds and link to Amazon, where
          purchases actually happen. We work hard to keep content accurate and useful, but we can&apos;t
          guarantee that third-party product information, prices or availability are current — Amazon always is.
        </p>
      </LegalSection>

      <LegalSection title="No storefront, no transactions">
        <p>
          {settings.siteName} does not sell products, process payments, or handle shipping and returns. Any
          purchase you make through a linked product happens entirely on Amazon under Amazon&apos;s terms,
          pricing, privacy policy and return policies. Any order questions must go to Amazon or the seller.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The written content, curation and design of this site are the property of {settings.siteName}. Product
          names, images and trademarks belong to their respective owners and are used here for identification and
          editorial reference. You may share and link to our content freely — please don&apos;t republish it
          wholesale or present it as your own.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <ul className="list-disc space-y-2 pl-6">
          <li>Don&apos;t attempt to access the admin area, probe for vulnerabilities, or disrupt the site.</li>
          <li>Don&apos;t scrape, spam our forms, or use our content to train commercial datasets without permission.</li>
          <li>Don&apos;t misrepresent affiliate links as your own.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          The site is provided &ldquo;as is.&rdquo; To the maximum extent permitted by law, {settings.siteName}{" "}
          is not liable for any indirect or consequential damages arising from your use of the site, including
          decisions made or purchases placed based on our content. Our total liability, if any, is limited to
          nothing — because we never charge you anything to use the site.
        </p>
      </LegalSection>

      <LegalSection title="Third-party links">
        <p>
          We link to Amazon and occasionally to social platforms. We don&apos;t control those sites and are not
          responsible for their content, policies or practices. Your use of them is at your own risk and subject
          to their terms.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these Terms from time to time. Changes take effect when posted on this page with a new
          &ldquo;last updated&rdquo; date. Questions? Email{" "}
          <a href={`mailto:${settings.contactEmail}`} className="font-medium text-sage-deep underline">
            {settings.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
