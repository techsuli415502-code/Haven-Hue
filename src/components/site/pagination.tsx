import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Server-rendered pagination that preserves existing query params.
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
  className,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) search.set(k, v);
    }
    if (p > 1) search.set("page", String(p));
    const qs = search.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  const pages: number[] = [];
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, Math.max(page + 2, 5));
  for (let i = windowStart; i <= windowEnd; i++) pages.push(i);

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors",
      active
        ? "border-sage bg-sage text-white"
        : "border-border bg-card text-foreground/75 hover:border-sage hover:text-sage-deep",
    );

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-2", className)}>
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={linkClass(false)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
      {pages[0] > 1 && (
        <>
          <Link href={hrefFor(1)} className={linkClass(1 === page)}>
            1
          </Link>
          {pages[0] > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}
      {pages.map((p) => (
        <Link key={p} href={hrefFor(p)} className={linkClass(p === page)} aria-current={p === page ? "page" : undefined}>
          {p}
        </Link>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-muted-foreground">…</span>}
          <Link href={hrefFor(totalPages)} className={linkClass(totalPages === page)}>
            {totalPages}
          </Link>
        </>
      )}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className={linkClass(false)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
