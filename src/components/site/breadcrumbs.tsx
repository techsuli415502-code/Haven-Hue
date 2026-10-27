import Link from "next/link";
import type { BreadcrumbEntry } from "@/lib/types";

export function Breadcrumbs({ items }: { items: BreadcrumbEntry[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-sage-deep">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-foreground/80" : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && <span aria-hidden="true" className="text-border">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
