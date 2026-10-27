import Link from "next/link";
import { ArrowRight, Sparkles, ThumbsUp, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ProductCard } from "@/components/site/product-card";
import { CategoryCard } from "@/components/site/category-card";
import { PostCard } from "@/components/site/post-card";
import { SmartImage } from "@/components/site/smart-image";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { PinterestIcon } from "@/components/site/social-icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();

  const [featuredCategories, featuredProducts, latestProducts, latestPosts] = await Promise.all([
    db.category.findMany({
      where: { featured: true },
      orderBy: [{ sortOrder: "asc" }],
      take: 6,
      include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
    }),
    db.product.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: { category: true },
    }),
    db.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 8,
      include: { category: true },
    }),
    db.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const products = featuredProducts.length >= 4 ? featuredProducts : latestProducts.slice(0, 4);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-sand" aria-labelledby="hero-heading">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Curated home decor finds
            </p>
            <h1 id="hero-heading" className="text-balance text-4xl font-medium leading-[1.12] sm:text-5xl lg:text-[3.4rem]">
              {settings.heroHeading}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
              {settings.heroSubheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-sage">
                Shop Decor
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/blog" className="btn-outline">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Explore Ideas
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ThumbsUp className="h-4 w-4 text-sage" aria-hidden="true" />
              Hand-picked finds, styling ideas, and honest recommendations
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-3 rounded-[2rem] border border-sage/25" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border/60 bg-secondary shadow-[0_24px_60px_rgba(46,43,38,0.14)]">
              <SmartImage
                src={settings.heroImage}
                alt="Bright, warmly styled living room with layered neutral decor"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-5 left-6 hidden items-center gap-3 rounded-2xl border border-border/70 bg-card px-5 py-3.5 shadow-lg sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft text-sage-deep">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">Fresh decor finds</p>
                <p className="text-xs text-muted-foreground">& styling ideas, added regularly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Affiliate disclosure strip ---------------- */}
      <div className="border-b border-border/70 bg-background">
        <div className="container-page py-3">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            {settings.affiliateDisclosure} We only feature pieces we&apos;d use in our own homes.{" "}
            <Link href="/affiliate-disclosure" className="font-medium text-sage-deep underline decoration-sage/40 underline-offset-2 hover:decoration-sage">
              Learn more
            </Link>
          </p>
        </div>
      </div>

      {/* ---------------- Featured categories ---------------- */}
      <section className="container-page py-14 lg:py-20" aria-labelledby="categories-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Shop by room & style</p>
            <h2 id="categories-heading" className="text-3xl font-medium">
              Featured Categories
            </h2>
          </div>
          <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-deep hover:text-sage">
            View all categories
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {featuredCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
            {featuredCategories.map((c, i) => (
              <CategoryCard key={c.id} category={c} productCount={c._count.products} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No featured categories yet — add categories in the admin dashboard and mark them as featured.
          </p>
        )}
      </section>

      {/* ---------------- Products ---------------- */}
      <section className="bg-sand py-14 lg:py-20" aria-labelledby="products-heading">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Loved & curated</p>
              <h2 id="products-heading" className="text-3xl font-medium">
                Featured Decor Finds
              </h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-deep hover:text-sage">
              Shop all products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} settings={settings} priority={i < 2} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No products yet — add your first Amazon find in the admin dashboard.
            </p>
          )}
        </div>
      </section>

      {/* ---------------- Blog ---------------- */}
      <section className="container-page py-14 lg:py-20" aria-labelledby="blog-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Popular home decor ideas</p>
            <h2 id="blog-heading" className="text-3xl font-medium">
              From the Blog
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-deep hover:text-sage">
            Read all articles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {latestPosts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i === 0} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No articles yet — publish your first decor guide from the admin dashboard.
          </p>
        )}
      </section>

      {/* ---------------- Pinterest ---------------- */}
      {settings.pinterestUrl && (
        <section className="bg-sand py-14 lg:py-20" aria-labelledby="pinterest-heading">
          <div className="container-page grid items-center gap-10 lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative aspect-[2/3] overflow-hidden rounded-[1.5rem] border border-border/60 bg-secondary shadow-[0_20px_50px_rgba(46,43,38,0.12)]">
                <SmartImage
                  src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=900&h=1350&q=80"
                  alt="Vertical styled home decor scene, perfect for saving on Pinterest"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <span className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E60023] text-white shadow-lg">
                <PinterestIcon className="h-5 w-5" />
              </span>
            </div>
            <div>
              <p className="eyebrow mb-2">Daily inspiration</p>
              <h2 id="pinterest-heading" className="text-3xl font-medium">
                Follow Along on Pinterest
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-8 text-muted-foreground">
                Every product and article on this site is pinned to our boards — room-by-room ideas, styling
                formulas, and the decor finds worth saving. Tap through and build your dream-home mood board.
              </p>
              <a
                href={settings.pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sage mt-7"
                aria-label="Visit our Pinterest profile (opens in a new tab)"
              >
                <PinterestIcon className="h-4 w-4" aria-hidden="true" />
                Follow on Pinterest
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Newsletter ---------------- */}
      {settings.newsletterEnabled && (
        <section className="container-page pb-16 pt-2" aria-labelledby="newsletter-heading">
          <div className="rounded-[1.75rem] border border-border/70 bg-sage-soft/50 px-6 py-12 text-center sm:px-12">
            <p className="eyebrow mb-2">Stay inspired</p>
            <h2 id="newsletter-heading" className="text-3xl font-medium">
              Get fresh decor ideas in your inbox
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              A short, friendly email now and then with new finds and styling guides. No spam, unsubscribe anytime.
            </p>
            <div className="mt-7 flex justify-center">
              <NewsletterForm />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
