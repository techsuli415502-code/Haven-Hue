import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { LegalShell, LegalSection } from "@/components/site/legal-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How this site earns commissions through Amazon Associates links, and what that means for you as a reader.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default async function AffiliateDisclosurePage() {
  const settings = await getSettings();

  return (
    <LegalShell
      title="Affiliate Disclosure"
      updated="October 2026"
      intro="Transparency matters to us. This page explains, in plain language, how this website makes money and what our relationship with Amazon is — and is not."
    >
      <div className="mb-8 rounded-xl border border-sage/30 bg-sage-soft/50 px-5 py-4 leading-7 text-sage-deep">
        <p className="font-medium">{settings.affiliateDisclosure}</p>
      </div>

      <LegalSection title="What affiliate links are">
        <p>
          Some links on this site are &ldquo;affiliate links.&rdquo; If you click one and make a purchase on
          Amazon, we may earn a small commission from Amazon. You pay exactly the same price you would pay
          otherwise — the commission comes out of Amazon&apos;s margin, never out of your pocket. Affiliate links
          are used on product pages, product cards, and occasionally inside articles where a product is mentioned.
        </p>
      </LegalSection>

      <LegalSection title="Why we use them">
        <p>
          Running a curation site takes real time: researching products, checking materials, writing honest
          pros and cons, and keeping content up to date. Affiliate commissions are what make that work possible
          without charging readers, running intrusive ads, or selling your data.
        </p>
      </LegalSection>

      <LegalSection title="What this does NOT mean">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Amazon does not endorse this site.</strong> We are a participant in the Amazon Services LLC
            Associates Program and similar regional programs, but Amazon is not involved in our content, our
            opinions, or our recommendations.
          </li>
          <li>
            <strong>We are not a store.</strong> We don&apos;t sell, ship, price, or accept returns for any
            product. Everything is purchased on Amazon under Amazon&apos;s terms, prices and return policies.
          </li>
          <li>
            <strong>Prices and availability change.</strong> We deliberately avoid displaying live prices,
            stock levels or ratings, because they change constantly and belong to Amazon. Always check the
            current price on the Amazon product page.
          </li>
          <li>
            <strong>Commissions never buy opinions.</strong> Where we list things we don&apos;t like about a
            product, that assessment is written by us and stays in.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Our editorial promise">
        <p>
          We feature products we would genuinely consider for our own homes. When products fall short, we say so
          in the &ldquo;keep in mind&rdquo; section of each product page. If we ever change how this site earns
          money, we will update this disclosure before the change takes effect.
        </p>
      </LegalSection>

      <LegalSection title="Questions?">
        <p>
          If anything here is unclear, or you&apos;d like to know how a specific link works, contact us at{" "}
          <a href={`mailto:${settings.contactEmail}`} className="font-medium text-sage-deep underline">
            {settings.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
