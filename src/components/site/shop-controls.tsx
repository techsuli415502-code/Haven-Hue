"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shop search + sort controls. Category chips are rendered server-side as links.
 * All filtering happens via URL params so results are shareable and SSR-rendered.
 */
export function ShopSearchSort({ sort }: { sort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const firstRender = useRef(true);

  // Debounced search: update the URL shortly after typing stops.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q.trim()) params.set("q", q.trim());
      else params.delete("q");
      params.delete("page");
      router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const changeSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <input
          id="shop-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search decor finds…"
          className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25"
        />
      </div>
      <div>
        <label htmlFor="shop-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => changeSort(e.target.value)}
          className="h-11 w-full rounded-full border border-input bg-card px-4 text-sm outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/25 sm:w-auto"
        >
          <option value="newest">Newest first</option>
          <option value="featured">Featured</option>
          <option value="title-asc">Name A–Z</option>
          <option value="title-desc">Name Z–A</option>
        </select>
      </div>
    </div>
  );
}

/** Horizontal scrollable category filter chips. */
export function CategoryChips({
  categories,
  active,
}: {
  categories: { slug: string; name: string }[];
  active?: string;
}) {
  const all = [{ slug: "", name: "All" }, ...categories];
  return (
    <div className="thin-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter by category">
      {all.map((c) => {
        const isActive = (active ?? "") === c.slug;
        return (
          <a
            key={c.slug || "all"}
            href={c.slug ? `/shop?category=${c.slug}` : "/shop"}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-sage bg-sage text-white"
                : "border-border bg-card text-foreground/75 hover:border-sage hover:text-sage-deep",
            )}
          >
            {c.name}
          </a>
        );
      })}
    </div>
  );
}
