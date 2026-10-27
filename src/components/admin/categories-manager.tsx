"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Shapes, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugifyClient } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  imageAlt: string | null;
  featured: boolean;
  sortOrder: number;
  _count: { products: number };
}

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25";

interface FormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  sortOrder: number;
}

const emptyForm: FormState = { name: "", slug: "", description: "", image: "", imageAlt: "", featured: false, sortOrder: 0 };

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && data.ok) setCategories(data.categories);
      else toast.error(data.error ?? "Failed to load categories.");
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || saving) return;
    if (form.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(form.id ? `/api/admin/categories/${form.id}` : "/api/admin/categories", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          image: form.image,
          imageAlt: form.imageAlt,
          featured: form.featured,
          sortOrder: form.sortOrder,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(form.id ? "Category updated." : "Category created.");
        setForm(null);
        load();
      } else {
        toast.error(data.error ?? "Save failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
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
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Categories organize your shop and appear in the header menu and footer.
        </p>
        <button
          type="button"
          onClick={() => {
            setSlugTouched(false);
            setForm({ ...emptyForm });
          }}
          className="btn-sage shrink-0 px-4 py-2.5 text-xs"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Shapes className="mb-3 h-10 w-10 text-sage/40" aria-hidden="true" />
          <p className="font-medium">No categories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first category to organize products.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <SmartImage src={c.image} alt={c.imageAlt || c.name} sizes="80px" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-medium">{c.name}</p>
                  {c.featured && <Star className="h-3.5 w-3.5 shrink-0 text-sage" aria-label="Featured" />}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {c._count.products} {c._count.products === 1 ? "product" : "products"} · /{c.slug}
                </p>
                <div className="mt-1.5 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSlugTouched(true);
                      setForm({
                        id: c.id,
                        name: c.name,
                        slug: c.slug,
                        description: c.description ?? "",
                        image: c.image ?? "",
                        imageAlt: c.imageAlt ?? "",
                        featured: c.featured,
                        sortOrder: c.sortOrder,
                      });
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${c.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(c)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-destructive/70 hover:bg-terracotta-soft hover:text-destructive"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit dialog */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="cat-dialog-title">
          <button type="button" aria-label="Close" className="fixed inset-0 bg-black/40" onClick={() => setForm(null)} />
          <div className="relative my-8 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 id="cat-dialog-title" className="font-display text-lg">
              {form.id ? "Edit category" : "New category"}
            </h3>
            <form onSubmit={save} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="c-name" className="text-sm font-medium">Name <span className="text-destructive" aria-hidden="true">*</span></label>
                <input
                  id="c-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value, slug: slugTouched ? form.slug : slugifyClient(e.target.value) });
                  }}
                  placeholder="e.g. Lamps & Lighting"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="c-slug" className="text-sm font-medium">Slug</label>
                <input
                  id="c-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm({ ...form, slug: slugifyClient(e.target.value) });
                  }}
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="c-desc" className="text-sm font-medium">Description</label>
                <textarea id="c-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="c-image" className="text-sm font-medium">Image URL</label>
                <input id="c-image" type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… or /uploads/…" className={cn(inputClass, "font-mono text-xs")} />
                {form.image && (
                  <span className="relative mt-1 block aspect-[4/3] w-32 overflow-hidden rounded-md border border-border bg-secondary">
                    <SmartImage src={form.image} alt="Category preview" sizes="128px" />
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="c-alt" className="text-sm font-medium">Image alt text</label>
                <input id="c-alt" type="text" value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} className={inputClass} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[var(--sage)]" />
                  Featured on homepage
                </label>
                <div className="flex items-center gap-2">
                  <label htmlFor="c-order" className="text-sm">Sort order</label>
                  <input id="c-order" type="number" min={0} max={999} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })} className={cn(inputClass, "w-20")} />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button type="button" onClick={() => setForm(null)} className="btn-outline px-4 py-2 text-xs">Cancel</button>
                <button type="submit" disabled={saving} className="btn-sage px-5 py-2 text-xs">
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                  {form.id ? "Save changes" : "Create category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="cat-del-title">
          <button type="button" aria-label="Cancel" className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 id="cat-del-title" className="font-display text-lg">Delete “{deleteTarget.name}”?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Products in this category are kept but become uncategorized. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="btn-outline px-4 py-2 text-xs">Cancel</button>
              <button type="button" onClick={del} className="rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90">Delete permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
