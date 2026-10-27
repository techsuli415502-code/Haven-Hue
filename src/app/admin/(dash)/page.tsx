import Link from "next/link";
import { ArrowRight, Lightbulb, Package, PenSquare, Shapes, Inbox, Plus, Eye, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatDateTime } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const settings = await getSettings();

  const [
    publishedProducts,
    draftProducts,
    featuredProducts,
    publishedPosts,
    draftPosts,
    categoryCount,
    unreadMessages,
    subscriberCount,
    recentProducts,
    recentPosts,
  ] = await Promise.all([
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.product.count({ where: { status: "DRAFT" } }),
    db.product.count({ where: { status: "PUBLISHED", featured: true } }),
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.post.count({ where: { status: "DRAFT" } }),
    db.category.count(),
    db.contactMessage.count({ where: { read: false } }),
    db.subscriber.count(),
    db.product.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { category: true } }),
    db.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Published products", value: publishedProducts, href: "/admin/products?status=PUBLISHED", icon: Package },
    { label: "Draft products", value: draftProducts, href: "/admin/products?status=DRAFT", icon: Package },
    { label: "Published posts", value: publishedPosts, href: "/admin/posts?status=PUBLISHED", icon: PenSquare },
    { label: "Draft posts", value: draftPosts, href: "/admin/posts?status=DRAFT", icon: PenSquare },
    { label: "Categories", value: categoryCount, href: "/admin/categories", icon: Shapes },
    { label: "Unread messages", value: unreadMessages, href: "/admin/messages", icon: Inbox },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back — here&apos;s what&apos;s happening on {settings.siteName}.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="btn-sage px-4 py-2 text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add product
          </Link>
          <Link href="/admin/posts/new" className="btn-outline px-4 py-2 text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New post
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section aria-label="Summary" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-sage-soft text-sage-deep">
              <s.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-sage-deep">{s.label}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent products */}
        <section aria-labelledby="recent-products" className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 id="recent-products" className="text-sm font-semibold">
              Recently updated products
            </h2>
            <Link href="/admin/products" className="flex items-center gap-1 text-xs font-medium text-sage-deep hover:text-sage">
              View all
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentProducts.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground">No products yet — add your first one.</li>
            )}
            {recentProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category?.name ?? "Uncategorized"} · {formatDateTime(p.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={
                      p.status === "PUBLISHED"
                        ? "rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] font-semibold text-sage-deep"
                        : "rounded-full bg-terracotta-soft px-2.5 py-0.5 text-[11px] font-semibold text-terracotta"
                    }
                  >
                    {p.status === "PUBLISHED" ? "Live" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${p.title}`}
                  >
                    <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent posts */}
        <section aria-labelledby="recent-posts" className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 id="recent-posts" className="text-sm font-semibold">
              Recently updated posts
            </h2>
            <Link href="/admin/posts" className="flex items-center gap-1 text-xs font-medium text-sage-deep hover:text-sage">
              View all
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentPosts.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground">No posts yet — write your first article.</li>
            )}
            {recentPosts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {formatDateTime(p.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={
                      p.status === "PUBLISHED"
                        ? "rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] font-semibold text-sage-deep"
                        : "rounded-full bg-terracotta-soft px-2.5 py-0.5 text-[11px] font-semibold text-terracotta"
                    }
                  >
                    {p.status === "PUBLISHED" ? "Live" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${p.title}`}
                  >
                    <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Affiliate tips */}
        <section aria-labelledby="tips" className="rounded-xl border border-sage/25 bg-sage-soft/40 p-5">
          <h2 id="tips" className="mb-3 flex items-center gap-2 text-sm font-semibold text-sage-deep">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            Getting started with affiliates
          </h2>
          <ul className="space-y-2.5 text-sm leading-6 text-foreground/85">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
              Replace the demo products with your own — their Amazon links are placeholder search URLs.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
              Set your Associates tracking ID in <Link href="/admin/settings" className="font-medium text-sage-deep underline">Settings → Affiliate</Link> — it is appended to every product link automatically.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
              Keep prices/ratings off product pages unless you have a compliant source for them — this keeps you within Amazon Associates rules.
            </li>
          </ul>
        </section>

        {/* At a glance */}
        <section aria-labelledby="glance" className="rounded-xl border border-border bg-card p-5">
          <h2 id="glance" className="mb-3 text-sm font-semibold">
            At a glance
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Featured products</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">{featuredProducts}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Newsletter subscribers</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">{subscriberCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Homepage hero</dt>
              <dd className="mt-0.5 text-sm">
                <Link href="/admin/settings" className="font-medium text-sage-deep underline">
                  Edit heading & image
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Contact inbox</dt>
              <dd className="mt-0.5 text-sm">
                <Link href="/admin/messages" className="font-medium text-sage-deep underline">
                  {unreadMessages} unread
                </Link>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
