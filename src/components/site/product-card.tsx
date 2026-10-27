import Link from "next/link";
import { AffiliateButton } from "./affiliate-button";
import { SmartImage } from "./smart-image";
import { parseList } from "@/lib/data";
import type { ProductWithCategory, SiteSettings } from "@/lib/types";

export function ProductCard({
  product,
  settings,
  priority = false,
}: {
  product: ProductWithCategory;
  settings: SiteSettings;
  priority?: boolean;
}) {
  const images = parseList(product.images);
  const cover = images[0];
  const categoryHref = product.category ? `/category/${product.category.slug}` : "/shop";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(46,43,38,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(46,43,38,0.10)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-secondary"
        aria-label={product.title}
      >
        <SmartImage
          src={cover}
          alt={product.imageAlt || product.title}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sage-deep backdrop-blur">
            {product.category.name}
          </span>
        )}
        {product.status === "DRAFT" && (
          <span className="absolute right-3 top-3 rounded-full bg-terracotta px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            Draft
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg leading-snug">
          <Link href={`/product/${product.slug}`} className="transition-colors group-hover:text-sage-deep">
            {product.title}
          </Link>
        </h3>
        {product.shortDescription && (
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-3">
          <Link
            href={`/product/${product.slug}`}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-sage-deep"
          >
            See details →
          </Link>
          <AffiliateButton product={product} settings={settings} className="btn-sage w-full py-2.5 text-[13px]" />
        </div>
      </div>
    </article>
  );
}
