"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, ImagePlus, Loader2, Save, Star, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { slugifyClient } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";

export interface ProductFormValues {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  pinterestImage: string;
  imageAlt: string;
  categoryId: string;
  subcategory: string;
  amazonUrl: string;
  asin: string;
  price: string;
  features: string; // one item per line
  pros: string;
  cons: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
}

export const emptyProduct: ProductFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  images: [],
  pinterestImage: "",
  imageAlt: "",
  categoryId: "",
  subcategory: "",
  amazonUrl: "",
  asin: "",
  price: "",
  features: "",
  pros: "",
  cons: "",
  featured: false,
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
};

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25";

function toPayload(v: ProductFormValues) {
  const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
  return {
    title: v.title,
    slug: v.slug,
    shortDescription: v.shortDescription,
    description: v.description,
    images: v.images,
    pinterestImage: v.pinterestImage,
    imageAlt: v.imageAlt,
    categoryId: v.categoryId,
    subcategory: v.subcategory,
    amazonUrl: v.amazonUrl,
    asin: v.asin,
    price: v.price,
    features: lines(v.features),
    pros: lines(v.pros),
    cons: lines(v.cons),
    featured: v.featured,
    status: v.status,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
  };
}

export function ProductForm({
  mode,
  productId,
  initial,
}: {
  mode: "new" | "edit";
  productId?: string;
  initial?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>({ ...emptyProduct, ...initial });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(initial?.slug ?? null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pinFileRef = useRef<HTMLInputElement>(null);
  const slugTouched = useRef(Boolean(initial?.slug));

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setCategories(d.categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
      })
      .catch(() => toast.error("Could not load categories."));
  }, []);

  // Auto-generate the slug from the title until the user edits it manually.
  useEffect(() => {
    if (!slugTouched.current && v.title) {
      setV((prev) => ({ ...prev, slug: slugifyClient(prev.title) }));
    }
  }, [v.title]);

  const validate = (): string | null => {
    if (v.title.trim().length < 3) return "Product title must be at least 3 characters.";
    if (!/^https?:\/\/([a-z0-9-]+\.)*amazon\.[a-z.]+|https?:\/\/amzn\.to/i.test(v.amazonUrl.trim())) {
      return "The Amazon URL must be a valid link starting with https://www.amazon.com/… (or amzn.to).";
    }
    return null;
  };

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (saving) return;
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(mode === "new" ? "/api/admin/products" : `/api/admin/products/${productId}`, {
        method: mode === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(v)),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(
          v.status === "PUBLISHED"
            ? "Product saved and published — it's live on the site."
            : "Product saved as draft.",
        );
        setSavedSlug(data.product.slug);
        if (mode === "new") {
          router.replace(`/admin/products/${data.product.id}/edit`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(data.error ?? "Saving failed.");
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File, target: "gallery" | "pinterest") => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (target === "gallery") set("images", [...v.images, data.media.url]);
        else set("pinterestImage", data.media.url);
        toast.success("Image uploaded.");
      } else {
        toast.error(data.error ?? "Upload failed.");
      }
    } catch {
      toast.error("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const seoTitleLeft = 60 - v.seoTitle.length;
  const seoDescLeft = 160 - v.seoDescription.length;

  const previewHref = useMemo(() => (savedSlug ? `/product/${savedSlug}` : null), [savedSlug]);

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Actions bar */}
      <div className="sticky top-14 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to products
        </Link>
        <div className="flex items-center gap-2">
          {previewHref && (
            <a href={previewHref} target="_blank" rel="noopener noreferrer" className="btn-outline px-4 py-2 text-xs">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Preview
            </a>
          )}
          <button type="submit" disabled={saving} className="btn-sage px-5 py-2 text-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Save className="h-3.5 w-3.5" aria-hidden="true" />}
            {mode === "new" ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="basics">
            <h2 id="basics" className="mb-4 text-sm font-semibold">Basics</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="p-title" className="text-sm font-medium">Product title <span className="text-destructive" aria-hidden="true">*</span></label>
                <input id="p-title" type="text" required value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Arched Rattan Wall Mirror" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="p-slug" className="text-sm font-medium">URL slug</label>
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:block">/product/</span>
                  <input id="p-slug" type="text" value={v.slug} onChange={(e) => { slugTouched.current = true; set("slug", slugifyClient(e.target.value)); }} className={cn(inputClass, "font-mono text-xs")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="p-short" className="text-sm font-medium">Short description <span className="text-xs text-muted-foreground">(shown on cards)</span></label>
                <textarea id="p-short" rows={2} value={v.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One or two sentences describing the piece." className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="p-desc" className="text-sm font-medium">Full description</label>
                <textarea id="p-desc" rows={7} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder={"Write what you love about it, materials, styling ideas…\n\nSeparate paragraphs with a blank line."} className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="images">
            <h2 id="images" className="mb-1 text-sm font-semibold">Images</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Vertical (2:3) images work best for Pinterest. First image is the cover.
            </p>
            <div className="space-y-3">
              {v.images.map((img, i) => (
                <div key={`${img}-${i}`} className="flex items-center gap-3">
                  <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                    <SmartImage src={img} alt={`Product image ${i + 1}`} sizes="80px" />
                  </span>
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => {
                      const next = [...v.images];
                      next[i] = e.target.value;
                      set("images", next);
                    }}
                    placeholder="https://… or /uploads/…"
                    className={cn(inputClass, "font-mono text-xs")}
                    aria-label={`Image ${i + 1} URL`}
                  />
                  <button
                    type="button"
                    onClick={() => set("images", v.images.filter((_, j) => j !== i))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-destructive/70 hover:bg-terracotta-soft hover:text-destructive"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => set("images", [...v.images, ""])}
                className="btn-outline px-4 py-2 text-xs"
              >
                <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                Add image URL
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline px-4 py-2 text-xs">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
                Upload from device
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, "gallery");
                  e.target.value = "";
                }}
              />
            </div>

            <div className="mt-5 space-y-1.5 border-t border-border pt-4">
              <label htmlFor="p-pin" className="text-sm font-medium">Pinterest image <span className="text-xs text-muted-foreground">(optional, 2:3 ratio recommended)</span></label>
              <div className="flex items-center gap-2">
                <input id="p-pin" type="text" value={v.pinterestImage} onChange={(e) => set("pinterestImage", e.target.value)} placeholder="https://… or /uploads/…" className={cn(inputClass, "font-mono text-xs")} />
                <button type="button" onClick={() => pinFileRef.current?.click()} disabled={uploading} className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:border-sage hover:text-sage-deep">
                  <Upload className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                  Upload
                </button>
                <input
                  ref={pinFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFile(f, "pinterest");
                    e.target.value = "";
                  }}
                />
              </div>
              {v.pinterestImage && (
                <span className="relative mt-2 block aspect-[2/3] w-24 overflow-hidden rounded-md border border-border bg-secondary">
                  <SmartImage src={v.pinterestImage} alt="Pinterest image preview" sizes="96px" />
                </span>
              )}
            </div>

            <div className="mt-5 space-y-1.5 border-t border-border pt-4">
              <label htmlFor="p-alt" className="text-sm font-medium">Image alt text</label>
              <input id="p-alt" type="text" value={v.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} placeholder="Describe the image for screen readers and SEO" className={inputClass} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="details">
            <h2 id="details" className="mb-4 text-sm font-semibold">Good to know</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="p-features" className="text-sm font-medium">Features <span className="text-xs text-muted-foreground">(one per line)</span></label>
                <textarea id="p-features" rows={4} value={v.features} onChange={(e) => set("features", e.target.value)} placeholder={"Handwoven rattan frame\nLightweight — hangs on one hook"} className={inputClass} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="p-pros" className="text-sm font-medium">What we like <span className="text-xs text-muted-foreground">(one per line)</span></label>
                  <textarea id="p-pros" rows={4} value={v.pros} onChange={(e) => set("pros", e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="p-cons" className="text-sm font-medium">Keep in mind <span className="text-xs text-muted-foreground">(one per line)</span></label>
                  <textarea id="p-cons" rows={4} value={v.cons} onChange={(e) => set("cons", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="seo">
            <h2 id="seo" className="mb-1 text-sm font-semibold">SEO</h2>
            <p className="mb-4 text-xs text-muted-foreground">Leave empty to use the title and short description.</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="p-seotitle" className="text-sm font-medium">SEO title</label>
                  <span className={cn("text-xs tabular-nums", seoTitleLeft < 0 ? "text-destructive" : "text-muted-foreground")}>{seoTitleLeft} left</span>
                </div>
                <input id="p-seotitle" type="text" value={v.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="p-seodesc" className="text-sm font-medium">Meta description</label>
                  <span className={cn("text-xs tabular-nums", seoDescLeft < 0 ? "text-destructive" : "text-muted-foreground")}>{seoDescLeft} left</span>
                </div>
                <textarea id="p-seodesc" rows={3} value={v.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={inputClass} />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="publish">
            <h2 id="publish" className="mb-4 text-sm font-semibold">Publishing</h2>
            <fieldset className="space-y-2.5">
              <legend className="sr-only">Publication status</legend>
              {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                <label
                  key={s}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    v.status === s ? "border-sage bg-sage-soft/50" : "border-border hover:border-sage/50",
                  )}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={v.status === s}
                    onChange={() => set("status", s)}
                    className="mt-0.5 accent-[var(--sage)]"
                  />
                  <span>
                    <span className="block text-sm font-medium">{s === "DRAFT" ? "Draft" : "Published"}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {s === "DRAFT"
                        ? "Hidden from visitors; previewable by admins only."
                        : "Visible on the shop, categories and search."}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-sage/50">
              <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-0.5 accent-[var(--sage)]" />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <Star className="h-3.5 w-3.5 text-sage" aria-hidden="true" />
                  Featured
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">Show in the homepage “Featured Decor Finds” section.</span>
              </span>
            </label>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="affiliate">
            <h2 id="affiliate" className="mb-4 text-sm font-semibold">Amazon affiliate</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="p-amazon" className="text-sm font-medium">Affiliate URL <span className="text-destructive" aria-hidden="true">*</span></label>
                <input id="p-amazon" type="url" required value={v.amazonUrl} onChange={(e) => set("amazonUrl", e.target.value)} placeholder="https://www.amazon.com/dp/XXXXXXXXXX" className={cn(inputClass, "font-mono text-xs")} />
                <p className="text-xs text-muted-foreground">Paste the link from Amazon Associates SiteStripe. Your tracking ID is added automatically if set.</p>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="p-asin" className="text-sm font-medium">ASIN <span className="text-xs text-muted-foreground">(optional)</span></label>
                <input id="p-asin" type="text" maxLength={10} value={v.asin} onChange={(e) => set("asin", e.target.value.toUpperCase())} placeholder="B0XXXXXXXX" className={cn(inputClass, "font-mono text-xs")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="p-price" className="text-sm font-medium">Reference price <span className="text-xs text-muted-foreground">(optional)</span></label>
                <input id="p-price" type="text" value={v.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. Around $45" className={inputClass} />
                <p className="text-xs leading-5 text-muted-foreground">
                  Amazon Associates rules limit showing prices. Only fill this in if you have a reliable,
                  permitted source — otherwise leave it empty and let Amazon show the live price.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="organize">
            <h2 id="organize" className="mb-4 text-sm font-semibold">Organization</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="p-category" className="text-sm font-medium">Category</label>
                <select id="p-category" value={v.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="p-subcat" className="text-sm font-medium">Subcategory <span className="text-xs text-muted-foreground">(optional)</span></label>
                <input id="p-subcat" type="text" value={v.subcategory} onChange={(e) => set("subcategory", e.target.value)} placeholder="e.g. Table Lamps" className={inputClass} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

export function DeleteProductButton({ productId, productTitle }: { productId: string; productTitle: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Deleted.");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(data.error ?? "Delete failed.");
        setDeleting(false);
      }
    } catch {
      toast.error("Network error.");
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive/80 transition-colors hover:bg-terracotta-soft hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        Delete
      </button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="del-product-title">
          <button type="button" aria-label="Cancel" className="absolute inset-0 bg-black/40" onClick={() => setConfirming(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 id="del-product-title" className="font-display text-lg">Delete this product?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              “{productTitle}” will be permanently removed from the website. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="btn-outline px-4 py-2 text-xs">Cancel</button>
              <button type="button" onClick={del} disabled={deleting} className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90">
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
