import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { SmartImage } from "./smart-image";
import { formatDate } from "@/lib/data";

export function PostCard({
  post,
  priority = false,
}: {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string | null;
    imageAlt?: string | null;
    category: string;
    publishedAt?: Date | null;
  };
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(46,43,38,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(46,43,38,0.10)]">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary" aria-label={post.title}>
        <SmartImage
          src={post.featuredImage}
          alt={post.imageAlt || post.title}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {post.category && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sage-deep backdrop-blur">
            {post.category}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg leading-snug">
          <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-sage-deep">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>}
        {post.publishedAt && (
          <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time>
          </p>
        )}
      </div>
    </article>
  );
}
