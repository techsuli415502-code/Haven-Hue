import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Info, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings, siteBaseUrl } from "@/lib/settings";
import { getSessionUser } from "@/lib/auth";
import { parseList, truncate } from "@/lib/data";
import { buildAffiliateUrl, affiliateRel } from "@/lib/affiliate";
import { ProductGallery } from "@/components/site/product-gallery";
import { AffiliateButton } from "@/components/site/affiliate-button";
import { ShareButtons } from "@/components/site/share-buttons";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductCard } from "@/components/site/product-card";
import { JsonLd } from "@/components/site/json-ld";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return db.product.findUnique({ where: { slug }, include: { category: true } });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  const settings = await getSettings();
  const isDraft = product.status !== "PUBLISHED";
  const images = parseList(product.images);
  const ogImage = product.pinterestImage || images[0] || undefined;
  const description = product.seoDescription || product.shortDescription || truncate(product.description, 155);

  return {
    title: product.seoTitle || product.title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    robots: isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: product.seoTitle || product.title,
      description,
      type: "article",
      url: `/product/${product.slug}`,
      siteName: settings.siteName,
      images: ogImage ? [{ url: ogImage, alt: product.imageAlt || product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const isDraft = product.status !== "PUBLISHED";
  const settings = await getSettings();
  const admin = await getSessionUser();

  // Drafts are hidden from visitors but previewable for logged-in admins.
  if (isDraft && !admin) notFound();

  const images = parseList(product.images);
  const features = parseList(product.features);
  const pros = parseList(product.pros);
  const cons = parseList(product.cons);
  const baseUrl = siteBaseUrl(settings);

  const related = product.categoryId
    ? await db.product.findMany({
        where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: product.id } },
        include: { category: true },
        take: 4,
        orderBy: { publishedAt: "desc" },
      })
    : [];

  const canonicalUrl = `${baseUrl}/product/${product.slug}`;
  const shareImage = product.pinterestImage || images[0] || null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Shop", item: `${baseUrl}/shop` },
            ...(product.category
              ? [
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: product.category.name,
                    item: `${baseUrl}/category/${product.category.slug}`,
                  },
                ]
              : []),
            { "@type": "ListItem", position: product.category ? 4 : 3, name: product.title },
          ],
        }}
      />

      <div className="container-page py-10 lg:py-14">
        {isDraft && admin && (
          <p className="mb-6 rounded-lg bg-terracotta-soft px-4 py-3 text-sm font-medium text-terracotta" role="status">
            Draft preview — this page is only visible to you until you publish it in the admin dashboard. Search
            engines are asked not to index it.
          </p>
        )}

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            ...(product.category
              ? [{ name: product.category.name, href: `/category/${product.category.slug}` }]
              : []),
            { name: product.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <ProductGallery images={images} alt={product.imageAlt || product.title} />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="mb-3 inline-flex w-fit items-center rounded-full bg-sage-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sage-deep transition-colors hover:bg-sage-soft/70"
              >
                {product.category.name}
                {product.subcategory ? ` · ${product.subcategory}` : ""}
              </Link>
            )}
            <h1 className="text-3xl font-medium leading-tight sm:text-4xl">{product.title}</h1>
            {product.shortDescription && (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{product.shortDescription}</p>
            )}

            <div className="my-7 border-t border-border" aria-hidden="true" />

            <div className="space-y-4">
              <AffiliateButton product={product} settings={settings} className="btn-sage w-full py-3.5 text-base" />
              <p className="text-center text-xs leading-5 text-muted-foreground">
                {settings.affiliateDisclosure} Price and availability on Amazon may vary.
              </p>
              {product.price && (
                <p className="flex items-start gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-foreground/80">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
                  <span>
                    Listed reference price: <span className="font-semibold">{product.price}</span> (admin-entered).
                    Check Amazon for the current price.
                  </span>
                </p>
              )}
            </div>

            {features.length > 0 && (
              <section className="mt-8" aria-labelledby="features-heading">
                <h2 id="features-heading" className="mb-3 text-lg font-medium">
                  What makes it good
                </h2>
                <ul className="space-y-2.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[15px] leading-6">
                      <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(pros.length > 0 || cons.length > 0) && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {pros.length > 0 && (
                  <div className="rounded-xl border border-sage/25 bg-sage-soft/40 p-5">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sage-deep">
                      What we like
                    </h2>
                    <ul className="space-y-2">
                      {pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm leading-6">
                          <Plus className="mt-1 h-3.5 w-3.5 shrink-0 text-sage" aria-hidden="true" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div className="rounded-xl border border-terracotta/20 bg-terracotta-soft/40 p-5">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-terracotta">
                      Keep in mind
                    </h2>
                    <ul className="space-y-2">
                      {cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm leading-6">
                          <Minus className="mt-1 h-3.5 w-3.5 shrink-0 text-terracotta" aria-hidden="true" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <ShareButtons url={canonicalUrl} title={product.title} imageUrl={shareImage} description={product.shortDescription ?? undefined} />
              <p className="text-xs text-muted-foreground">
                {product.asin ? `ASIN: ${product.asin}` : null}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <section className="mt-14 max-w-3xl" aria-labelledby="about-heading">
            <h2 id="about-heading" className="mb-5 text-2xl font-medium">
              About this piece
            </h2>
            <div className="space-y-5 text-[1.05rem] leading-8 text-foreground/90">
              {product.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <div className="mb-6 flex items-end justify-between">
              <h2 id="related-heading" className="text-2xl font-medium">
                More in {product.category?.name}
              </h2>
              <Link
                href={`/category/${product.category?.slug}`}
                className="text-sm font-medium text-sage-deep hover:text-sage"
              >
                View category →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} settings={settings} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
