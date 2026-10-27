import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, User } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings, siteBaseUrl } from "@/lib/settings";
import { getSessionUser } from "@/lib/auth";
import { renderMarkdown, extractToc, readingTimeMinutes } from "@/lib/markdown";
import { parseList, formatDate } from "@/lib/data";
import { SmartImage } from "@/components/site/smart-image";
import { ShareButtons } from "@/components/site/share-buttons";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PostCard } from "@/components/site/post-card";
import { JsonLd } from "@/components/site/json-ld";
import type { TocEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getPost(slug: string) {
  return db.post.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found" };

  const settings = await getSettings();
  const isDraft = post.status !== "PUBLISHED";
  const description = post.seoDescription || post.excerpt || undefined;

  return {
    title: post.seoTitle || post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: settings.siteName,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.pinterestImage || post.featuredImage
        ? [{ url: (post.pinterestImage || post.featuredImage)!, alt: post.imageAlt || post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description,
      images: post.pinterestImage || post.featuredImage ? [post.pinterestImage || post.featuredImage!] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const isDraft = post.status !== "PUBLISHED";
  const settings = await getSettings();
  const admin = await getSessionUser();
  if (isDraft && !admin) notFound();

  const baseUrl = siteBaseUrl(settings);
  const tags = parseList(post.tags);
  const readMinutes = readingTimeMinutes(post.content);

  const rendered = renderMarkdown(post.content);
  const { html, toc } = extractToc(rendered);
  const showToc = toc.length >= 3;

  const related = await db.post.findMany({
    where: { status: "PUBLISHED", category: post.category, id: { not: post.id } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.seoDescription || post.excerpt || undefined,
          image: post.pinterestImage || post.featuredImage || undefined,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: settings.siteName },
          mainEntityOfPage: canonicalUrl,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
          ],
        }}
      />

      <article className="container-page py-10 lg:py-14">
        {isDraft && admin && (
          <p className="mb-6 rounded-lg bg-terracotta-soft px-4 py-3 text-sm font-medium text-terracotta" role="status">
            Draft preview — only visible to you until published. Search engines are asked not to index it.
          </p>
        )}

        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title }]}
          />

          <header>
            <Link
              href={`/blog?tag=${encodeURIComponent(post.category)}`}
              className="mb-4 inline-flex items-center rounded-full bg-sage-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sage-deep transition-colors hover:bg-sage-soft/70"
            >
              {post.category}
            </Link>
            <h1 className="text-balance text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" aria-hidden="true" />
                {post.author}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {readMinutes} min read
              </span>
            </div>
          </header>

          {post.featuredImage && (
            <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-secondary">
              <SmartImage
                src={post.featuredImage}
                alt={post.imageAlt || post.title}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </figure>
          )}

          <div className="mt-8 flex justify-center sm:justify-end">
            <ShareButtons
              url={canonicalUrl}
              title={post.title}
              imageUrl={post.pinterestImage || post.featuredImage}
              description={post.excerpt || post.title}
            />
          </div>

          <div className="mt-8 flex flex-col gap-10 lg:flex-row-reverse lg:items-start">
            {showToc && (
              <nav
                aria-label="Table of contents"
                className="top-24 shrink-0 rounded-xl border border-border/70 bg-sand p-5 lg:sticky lg:w-64"
              >
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  On this page
                </h2>
                <ol className="space-y-2">
                  {toc.map((item: TocEntry) => (
                    <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm leading-6 text-foreground/75 transition-colors hover:text-sage-deep"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className={showToc ? "min-w-0 flex-1" : "w-full"}>
              <div className="prose-decor" dangerouslySetInnerHTML={{ __html: html }} />

              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                  <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </span>
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/75 transition-colors hover:border-sage hover:text-sage-deep"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl" aria-labelledby="related-posts">
            <h2 id="related-posts" className="mb-6 text-2xl font-medium">
              Keep reading
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
