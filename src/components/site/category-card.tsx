import Link from "next/link";
import { SmartImage } from "./smart-image";

export function CategoryCard({
  category,
  productCount,
  priority = false,
}: {
  category: { name: string; slug: string; image?: string | null; imageAlt?: string | null; description?: string | null };
  productCount?: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-border/60 bg-secondary sm:aspect-[3/4]"
      aria-label={`Browse ${category.name}`}
    >
      <SmartImage
        src={category.image}
        alt={category.imageAlt || category.name}
        priority={priority}
        className="transition-transform duration-500 group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-lg font-medium text-white sm:text-xl">{category.name}</h3>
        {typeof productCount === "number" && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/80">
            {productCount} {productCount === 1 ? "find" : "finds"}
          </p>
        )}
      </div>
    </Link>
  );
}
