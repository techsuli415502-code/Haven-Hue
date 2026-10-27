"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Eye,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTime, parseList } from "@/lib/data";
import type { Product } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type AdminProduct = Product & { category: { name: string; slug: string } | null };

export function ProductsTable({ initialStatus }: { initialStatus?: string }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(initialStatus ?? "");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (status) params.set("status", status);
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.ok) setProducts(data.products);
      else toast.error(data.error ?? "Failed to load products.");
    } catch {
      toast.error("Network error while loading products.");
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, q ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const togglePublish = async (p: AdminProduct) => {
    setBusyId(p.id);
    try {
      const next = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: p.title,
          slug: p.slug,
          shortDescription: p.shortDescription ?? "",
          description: p.description,
          images: parseList(p.images),
          pinterestImage: p.pinterestImage ?? "",
          imageAlt: p.imageAlt ?? "",
          categoryId: p.categoryId ?? "",
          subcategory: p.subcategory ?? "",
          amazonUrl: p.amazonUrl,
          asin: p.asin ?? "",
          price: p.price ?? "",
          features: parseList(p.features),
          pros: parseList(p.pros),
          cons: parseList(p.cons),
          featured: p.featured,
          status: next,
          seoTitle: p.seoTitle ?? "",
          seoDescription: p.seoDescription ?? "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(next === "PUBLISHED" ? "Product published." : "Product unpublished.");
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

  const duplicate = async (p: AdminProduct) => {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/products/${p.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Duplicated.");
        load();
      } else {
        toast.error(data.error ?? "Duplicate failed.");
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
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
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
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            id="product-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products by title…"
            className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="sr-only">Filter by status</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-sage"
          >
            <option value="">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
          <Link href="/admin/products/new" className="btn-sage px-4 py-2.5 text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Package className="mb-3 h-10 w-10 text-sage/40" aria-hidden="true" />
            <p className="font-medium">No products found</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {q || status ? "Try adjusting your search or filter." : "Add your first Amazon decor find to get started."}
            </p>
            {!q && !status && (
              <Link href="/admin/products/new" className="btn-sage mt-5 px-5 py-2.5 text-xs">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-semibold">Product</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Updated</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const images = parseList(p.images);
                  const busy = busyId === p.id;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="relative block h-12 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                            {images[0] ? (
                              <img src={images[0]} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {p.title}
                              {p.featured && (
                                <span className="ml-2 rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-sage-deep">
                                  Featured
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category?.name ?? "—"}</td>
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
                            title={p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          >
                            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </button>
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="View on site"
                            aria-label={`View ${p.title} on site`}
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => duplicate(p)}
                            disabled={busy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                            title="Duplicate as draft"
                            aria-label={`Duplicate ${p.title}`}
                          >
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Edit"
                            aria-label={`Edit ${p.title}`}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
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

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title}” will be permanently removed from the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
