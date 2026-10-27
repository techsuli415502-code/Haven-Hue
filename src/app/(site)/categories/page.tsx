import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CategoryCard } from "@/components/site/category-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Decor Categories",
  description:
    "Explore home decor by category — living room, bedroom, wall art, lighting, rugs, vases, storage, kitchen and bath finds.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });

  return (
    <div className="container-page py-10 lg:py-14">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Categories" }]} />

      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Find your style</p>
        <h1 className="text-3xl font-medium sm:text-4xl">Decor Categories</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Every find is organized into curated collections so you can shop the room you&apos;re working on — or
          wander and get inspired.
        </p>
      </header>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c, i) => (
            <CategoryCard key={c.id} category={c} productCount={c._count.products} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No categories yet — create your first category in the admin dashboard.
        </p>
      )}
    </div>
  );
}
