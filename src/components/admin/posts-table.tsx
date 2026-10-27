"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Loader2, PenSquare, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/data";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostsTable({ initialStatus }: { initialStatus?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(initialStatus ?? "");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (status) params.set("status", status);
      const res = await fetch(`/api/admin/posts?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.ok) setPosts(data.posts);
      else toast.error(data.error ?? "Failed to load posts.");
    } catch {
      toast.error("Network error while loading posts.");
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, q ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const togglePublish = async (p: Post) => {
    setBusyId(p.id);
    try {
      // Fetch full post to get all fields, then toggle status.
      const getRes = await fetch(`/api/admin/posts/${p.id}`);
      const getData = await getRes.json();
      if (!getRes.ok || !getData.ok) {
        toast.error("Could not load post for update.");
        return;
      }
      const full = getData.post;
      const next = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const res = await fetch(`/api/admin/posts/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: full.title,
          slug: full.slug,
          excerpt: full.excerpt ?? "",
          content: full.content ?? "",
          featuredImage: full.featuredImage ?? "",
          imageAlt: full.imageAlt ?? "",
          pinterestImage: full.pinterestImage ?? "",
          category: full.category,
          tags: (() => {
            try {
              return JSON.parse(full.tags ?? "[]");
            } catch {
              return [];
            }
          })(),
          author: full.author ?? "Editorial Team",
          status: next,
          seoTitle: full.seoTitle ?? "",
          seoDescription: full.seoDescription ?? "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(next === "PUBLISHED" ? "Post published." : "Post unpublished.");
        load();
      } else {
        toast.error(data.error ?? "Update failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/posts/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Deleted.");
        setDeleteTarget(null);
        load();
      } else {
        toast.error(data.error ?? "Delete failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="post-search" className="sr-only">Search posts</label>
          <input
            id="post-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts by title…"
            className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="post-status-filter" className="sr-only">Filter by status</label>
          <select
            id="post-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-sage"
          >
            <option value="">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
          <Link href="/admin/posts/new" className="btn-sage px-4 py-2.5 text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New post
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <PenSquare className="mb-3 h-10 w-10 text-sage/40" aria-hidden="true" />
            <p className="font-medium">No posts found</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {q || status ? "Try adjusting your search or filter." : "Write your first styling guide to attract Pinterest traffic."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-semibold">Post</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Updated</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((p) => {
                  const busy = busyId === p.id;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <p className="max-w-md truncate font-medium">{p.title}</p>
                        <p className="truncate text-xs text-muted-foreground">/blog/{p.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            p.status === "PUBLISHED"
                              ? "bg-sage-soft text-sage-deep"
                              : "bg-terracotta-soft text-terracotta",
                          )}
                        >
                          {p.status === "PUBLISHED" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateTime(p.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => togglePublish(p)}
                            disabled={busy}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                          >
                            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </button>
                          <Link
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="View on site"
                            aria-label={`View ${p.title} on site`}
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/admin/posts/${p.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Edit"
                            aria-label={`Edit ${p.title}`}
                          >
                            <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            disabled={busy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive/70 hover:bg-terracotta-soft hover:text-destructive disabled:opacity-50"
                            title="Delete"
                            aria-label={`Delete ${p.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="post-del-title">
          <button type="button" aria-label="Cancel" className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 id="post-del-title" className="font-display text-lg">Delete this post?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              “{deleteTarget.title}” will be permanently removed. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="btn-outline px-4 py-2 text-xs">Cancel</button>
              <button type="button" onClick={doDelete} className="rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90">Delete permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
