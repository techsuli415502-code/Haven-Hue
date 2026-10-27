import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HeartHandshake, ShoppingBag, PenLine } from "lucide-react";
import { getSettings, siteBaseUrl } from "@/lib/settings";
import { SmartImage } from "@/components/site/smart-image";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We curate honest, stylish home decor finds and practical styling guides — so you can build a home you love without the guesswork.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Honest curation",
    text: "Every find is chosen the way we'd choose for our own homes: does it look good in a real room, not just a photoshoot? If we wouldn't hang it, wear it out, or gift it — it doesn't make the cut.",
  },
  {
    icon: ShoppingBag,
    title: "Shop where you already shop",
    text: "We don't sell anything directly. Every product links to Amazon, so you get their prices, fast delivery and easy returns — and we earn a small commission at no extra cost to you.",
  },
  {
    icon: PenLine,
    title: "Ideas you can actually use",
    text: "Our guides are written to be practical: formulas, measurements, and styling steps you can copy this weekend — not vague mood boards or unattainable designer budgets.",
  },
];

export default async function AboutPage() {
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
            { "@type": "ListItem", position: 2, name: "About", item: `${baseUrl}/about` },
          ],
        }}
      />
      <div className="container-page py-10 lg:py-14">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Our story</p>
            <h1 className="text-3xl font-medium sm:text-4xl">A Home You Love, Without the Guesswork</h1>
            <div className="mt-5 space-y-4 leading-8 text-foreground/85">
              <p>
                {settings.siteName} started the way most decor obsessions do: with a half-decorated living room,
                forty open browser tabs, and the sinking feeling that most &ldquo;inspiration&rdquo; online is
                either unaffordable or unavailable. We wanted a place that simply said — here&apos;s a beautiful,
                realistic piece, here&apos;s how to style it, and here&apos;s where to get it.
              </p>
              <p>
                So that&apos;s what we built. We spend our days digging through decor listings so you don&apos;t
                have to, pulling out the woven mirrors, the warm brass lamps, the chunky throws and the ceramics
                that photograph well in real light — and writing honest notes about what&apos;s good and what to
                watch out for.
              </p>
              <p>
                Think of us as that friend with great taste who sends you links with a one-line review attached.
                That&apos;s the whole idea.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-sage/25" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border/60 bg-secondary shadow-[0_24px_60px_rgba(46,43,38,0.12)]">
              <SmartImage
                src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80"
                alt="A warmly styled interior with natural textures and soft light"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        <section className="mt-16" aria-labelledby="values-heading">
          <h2 id="values-heading" className="mb-8 text-2xl font-medium">
            What we believe
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-border/70 bg-card p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-sage-soft text-sage-deep">
                  <v.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-6 text-2xl font-medium">
            How we choose products
          </h2>
          <div className="prose-decor">
            <p>
              No robots, no scraping, no auto-generated lists. Every product on {settings.siteName} is added by a
              human who looked at it, read real feedback about it, and decided it was worth your attention. Our
              checklist is short and strict:
            </p>
            <ul>
              <li>
                <strong>Design first.</strong> It has to look genuinely good in a real, imperfect room — not just
                in a styled studio shot.
              </li>
              <li>
                <strong>Materials that make sense.</strong> We favor natural textures, solid construction, and
                finishes that age well.
              </li>
              <li>
                <strong>Honest caveats.</strong> Every product page lists what we like <em>and</em> what to keep
                in mind. Nothing is perfect, and pretending otherwise helps no one.
              </li>
              <li>
                <strong>Practical styling.</strong> Each find comes with ideas for where it actually works in your
                home.
              </li>
            </ul>
            <p>
              We earn a commission when you buy through our links — that&apos;s how the site stays independent
              enough to stay honest. If a piece isn&apos;t good enough to recommend to a friend, it
              doesn&apos;t matter what it pays.
            </p>
          </div>
        </section>

        <div className="mt-14 rounded-[1.75rem] border border-border/70 bg-sand px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-medium">Ready to make something cozy?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Start with the shop, or grab a coffee and dig into the styling guides.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-sage">
              Browse decor finds
            </Link>
            <Link href="/blog" className="btn-outline">
              Read the blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
