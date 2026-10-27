import type { Metadata } from "next";
import { Clock, Mail } from "lucide-react";
import { getSettings, siteBaseUrl } from "@/lib/settings";
import { ContactForm } from "@/components/site/contact-form";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SocialLinks } from "@/components/site/social-links";
import { JsonLd } from "@/components/site/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions, feedback, or collaboration ideas? Send us a message — we read everything and reply to real inquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const baseUrl = siteBaseUrl(settings);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Contact", item: `${baseUrl}/contact` },
          ],
        }}
      />
      <div className="container-page py-10 lg:py-14">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />

        <header className="mb-10 max-w-2xl">
          <p className="eyebrow mb-2">Say hello</p>
          <h1 className="text-3xl font-medium sm:text-4xl">Contact Us</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            A question about a find, a styling dilemma, a collaboration idea — or just want to share your finished
            room? We&apos;d genuinely love to hear from you.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-card p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-sage-deep">
                <Mail className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-lg">Email</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Write to us anytime at{" "}
                <a href={`mailto:${settings.contactEmail}`} className="font-medium text-sage-deep underline decoration-sage/40 underline-offset-2">
                  {settings.contactEmail}
                </a>
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-sage-deep">
                <Clock className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-lg">Response time</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                We typically reply within 2 business days. Your message lands directly in our inbox — a real human
                reads it.
              </p>
            </div>

            {settings.pinterestUrl && (
              <div className="rounded-xl border border-border/70 bg-card p-6">
                <h2 className="font-display text-lg">Find us online</h2>
                <p className="mb-3 mt-1 text-sm text-muted-foreground">
                  We share daily inspiration on social media.
                </p>
                <SocialLinks settings={settings} />
              </div>
            )}
          </aside>

          <div className="rounded-xl border border-border/70 bg-card p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
