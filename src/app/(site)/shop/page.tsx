import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ProductCard } from "@/components/site/product-card";
import { Pagination } from "@/components/site/pagination";
import { ShopSearchSort, CategoryChips } from "@/components/site/shop-controls";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Shop All Home Decor Finds",
  description:
    "Browse every hand-picked home decor find — wall art, lighting, rugs, vases, textiles and more. Filter by category and shop directly on Amazon.",
  alternates: { canonical: "/shop" },
};

type SearchParams = Promise<{ q?: string; category?: string; sort?: string; page?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category, sort = "newest", page = "1" } = await searchParams;
  const settings = await getSettings();

  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true },
  });

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category: { is: { slug: category } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { shortDescription: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "featured"
      ? [{ featured: "desc" as const }, { publishedAt: "desc" as const }]
      : sort === "title-asc"
        ? [{ title: "asc" as const }]
        : sort === "title-desc"
          ? [{ title: "desc" as const }]
          : [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];

  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const [totalCount, products] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy,
      include: { category: true },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalCount);
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Shop" },
            ...(activeCategory ? [{ "@type": "ListItem", position: 3, name: activeCategory.name }] : []),
          ],
        }}
      />
      <div className="container-page py-10 lg:py-14">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Shop" }]} />

        <header className="mb-8 max-w-2xl">
          <p className="eyebrow mb-2">The collection</p>
          <h1 className="text-3xl font-medium sm:text-4xl">
            {activeCategory ? `${activeCategory.name} Finds` : "Shop All Decor Finds"}
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Every piece below is hand-picked and linked straight to Amazon — you buy there, we earn a small
            commission at no extra cost to you.
          </p>
        </header>

        <div className="mb-6 space-y-4">
          <CategoryChips categories={categories} active={category} />
          <ShopSearchSort sort={sort} />
        </div>

        <p className="mb-6 text-sm text-muted-foreground" role="status" aria-live="polite">
          {totalCount > 0 ? `Showing ${start}–${end} of ${totalCount} finds` : "No finds to show"}
          {q ? (
            <>
              {" "}
              for <span className="font-medium text-foreground">“{q}”</span>
            </>
          ) : null}
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} settings={settings} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <SearchX className="mb-4 h-10 w-10 text-sage/50" aria-hidden="true" />
            <h2 className="font-display text-xl">No finds match your filters</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Try a different category, clear your search, or check back soon — new decor finds are added regularly.
            </p>
            <Link href="/shop" className="btn-sage mt-6">
              Clear all filters
            </Link>
          </div>
        )}

        <Pagination
          className="mt-12"
          page={currentPage}
          totalPages={totalPages}
          basePath="/shop"
          params={{ q, category, sort }}
        />
      </div>
    </>
  );
}
