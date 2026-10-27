import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { PostCard } from "@/components/site/post-card";
import { Pagination } from "@/components/site/pagination";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Home Decor Blog — Ideas & Styling Guides",
  description:
    "Practical home decor ideas, styling guides, and room-by-room inspiration to help you create a home you love.",
  alternates: { canonical: "/blog" },
};

type SearchParams = Promise<{ page?: string; tag?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { page = "1", tag } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(tag ? { tags: { contains: tag } } : {}),
  };

  const [totalCount, posts] = await Promise.all([
    db.post.count({ where }),
    db.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Popular tags across published posts
  const published = await db.post.findMany({ where: { status: "PUBLISHED" }, select: { tags: true } });
  const tagCounts = new Map<string, number>();
  for (const p of published) {
    try {
      const tags = JSON.parse(p.tags);
      if (Array.isArray(tags)) {
        for (const t of tags) {
          const key = String(t);
          tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
        }
      }
    } catch {
      // ignore malformed tags
    }
  }
  const popularTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="container-page py-10 lg:py-14">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />

      <header className="mb-8 max-w-2xl">
        <p className="eyebrow mb-2">Ideas & guides</p>
        <h1 className="text-3xl font-medium sm:text-4xl">The Home Decor Blog</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Styling formulas, room makeovers on a budget, and honest guides — written to be actually useful, not
          just pretty.
        </p>
      </header>

      {popularTags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Filter by tag">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topics</span>
          {tag && (
            <Link
              href="/blog"
              className="rounded-full border border-sage bg-sage px-3.5 py-1.5 text-xs font-medium text-white"
            >
              All topics ✕
            </Link>
          )}
          {popularTags.map(([t, count]) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              aria-current={tag === t ? "true" : undefined}
              className={
                tag === t
                  ? "rounded-full border border-sage bg-sage px-3.5 py-1.5 text-xs font-medium text-white"
                  : "rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/75 transition-colors hover:border-sage hover:text-sage-deep"
              }
            >
              {t} ({count})
            </Link>
          ))}
        </div>
      )}

      {posts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} priority={i < 3} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No articles yet{tag ? " for this topic" : ""} — check back soon for fresh styling guides.
        </p>
      )}

      <Pagination
        className="mt-12"
        page={currentPage}
        totalPages={totalPages}
        basePath="/blog"
        params={{ tag }}
      />
    </div>
  );
}
