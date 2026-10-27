import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getSessionUser } from "@/lib/auth";
import { ProductCard } from "@/components/site/product-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { siteBaseUrl } from "@/lib/settings";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getCategory(slug: string) {
  return db.category.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} — Decor Finds`,
    description:
      category.description ||
      `Browse hand-picked ${category.name.toLowerCase()} decor finds, curated and linked to Amazon.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} — Decor Finds`,
      description: category.description || undefined,
      images: category.image ? [{ url: category.image, alt: category.imageAlt || category.name }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const settings = await getSettings();
  const admin = await getSessionUser();
  const baseUrl = siteBaseUrl(settings);

  const products = await db.product.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: { category: true },
  });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Categories", item: `${baseUrl}/categories` },
            { "@type": "ListItem", position: 3, name: category.name, item: `${baseUrl}/category/${category.slug}` },
          ],
        }}
      />
      <div className="container-page py-10 lg:py-14">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Categories", href: "/categories" }, { name: category.name }]}
        />

        <header className="mb-10 max-w-2xl">
          <p className="eyebrow mb-2">Collection</p>
          <h1 className="text-3xl font-medium sm:text-4xl">{category.name}</h1>
          {category.description && <p className="mt-3 leading-7 text-muted-foreground">{category.description}</p>}
          <p className="mt-3 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "find" : "finds"} in this collection
          </p>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} settings={settings} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <SearchX className="mb-4 h-10 w-10 text-sage/50" aria-hidden="true" />
            <h2 className="font-display text-xl">Nothing here yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Finds for this collection are being curated right now. In the meantime, browse everything in the shop.
            </p>
            <Link href="/shop" className="btn-sage mt-6">
              Browse all finds
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
