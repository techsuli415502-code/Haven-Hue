"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Bold,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  Loader2,
  Pencil,
  Quote,
  Save,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { slugifyClient } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";

export interface PostFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  pinterestImage: string;
  category: string;
  tags: string; // comma separated in the form
  author: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
}

export const emptyPost: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  imageAlt: "",
  pinterestImage: "",
  category: "Decor Ideas",
  tags: "",
  author: "Editorial Team",
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
};

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25";

function toPayload(v: PostFormValues) {
  return {
    title: v.title,
    slug: v.slug,
    excerpt: v.excerpt,
    content: v.content,
    featuredImage: v.featuredImage,
    imageAlt: v.imageAlt,
    pinterestImage: v.pinterestImage,
    category: v.category,
    tags: v.tags.split(",").map((t) => t.trim()).filter(Boolean),
    author: v.author,
    status: v.status,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
  };
}

export function PostForm({
  mode,
  postId,
  initial,
}: {
  mode: "new" | "edit";
  postId?: string;
  initial?: Partial<PostFormValues>;
}) {
  const router = useRouter();
  const [v, setV] = useState<PostFormValues>({ ...emptyPost, ...initial });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(initial?.slug ?? null);
  const [uploadTarget, setUploadTarget] = useState<"featured" | "pinterest">("featured");
  const fileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const slugTouched = useRef(Boolean(initial?.slug));

  const set = <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!slugTouched.current && v.title) {
      setV((prev) => ({ ...prev, slug: slugifyClient(prev.title) }));
    }
  }, [v.title]);

  /** Insert or wrap markdown syntax around the current textarea selection. */
  const applyMd = (prefix: string, suffix: string, placeholder: string) => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + prefix + selected + suffix + value.slice(e);
    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + prefix.length, s + prefix.length + selected.length);
    });
  };

  const validate = (): string | null => {
    if (v.title.trim().length < 3) return "Post title must be at least 3 characters.";
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
      const res = await fetch(mode === "new" ? "/api/admin/posts" : `/api/admin/posts/${postId}`, {
        method: mode === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(v)),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(
          v.status === "PUBLISHED" ? "Post saved and published — it's live on the blog." : "Post saved as draft.",
        );
        setSavedSlug(data.post.slug);
        if (mode === "new") router.replace(`/admin/posts/${data.post.id}/edit`);
        else router.refresh();
      } else {
        toast.error(data.error ?? "Saving failed.");
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (uploadTarget === "featured") set("featuredImage", data.media.url);
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
  const previewHref = useMemo(() => (savedSlug ? `/blog/${savedSlug}` : null), [savedSlug]);

  const mdTools = [
    { icon: Bold, label: "Bold", action: () => applyMd("**", "**", "bold text") },
    { icon: Italic, label: "Italic", action: () => applyMd("*", "*", "italic text") },
    { icon: Heading2, label: "Heading 2", action: () => applyMd("\n## ", "\n", "Section heading") },
    { icon: Heading3, label: "Heading 3", action: () => applyMd("\n### ", "\n", "Sub heading") },
    { icon: List, label: "Bullet list", action: () => applyMd("\n- ", "\n", "List item") },
    { icon: Quote, label: "Quote", action: () => applyMd("\n> ", "\n", "A helpful tip") },
    { icon: Link2, label: "Link", action: () => applyMd("[", "](https://)", "link text") },
  ];

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="sticky top-14 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <Link href="/admin/posts" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to posts
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className="btn-outline px-4 py-2 text-xs"
            aria-pressed={previewOpen}
          >
            {previewOpen ? <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
            {previewOpen ? "Edit" : "Preview content"}
          </button>
          {previewHref && (
            <a href={previewHref} target="_blank" rel="noopener noreferrer" className="btn-outline px-4 py-2 text-xs">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              View live
            </a>
          )}
          <button type="submit" disabled={saving} className="btn-sage px-5 py-2 text-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Save className="h-3.5 w-3.5" aria-hidden="true" />}
            {mode === "new" ? "Create post" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="post-basics">
            <h2 id="post-basics" className="mb-4 text-sm font-semibold">Article</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="po-title" className="text-sm font-medium">Title <span className="text-destructive" aria-hidden="true">*</span></label>
                <input id="po-title" type="text" required value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 12 Cozy Living Room Ideas on a Budget" className={cn(inputClass, "text-lg font-medium")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="po-slug" className="text-sm font-medium">URL slug</label>
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:block">/blog/</span>
                  <input id="po-slug" type="text" value={v.slug} onChange={(e) => { slugTouched.current = true; set("slug", slugifyClient(e.target.value)); }} className={cn(inputClass, "font-mono text-xs")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="po-excerpt" className="text-sm font-medium">Excerpt <span className="text-xs text-muted-foreground">(shown on cards and in meta)</span></label>
                <textarea id="po-excerpt" rows={2} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="A one or two sentence summary of the article." className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="post-content">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="post-content" className="text-sm font-semibold">Content (Markdown)</h2>
              <p className="text-xs text-muted-foreground">Headings, lists, links &amp; images supported</p>
            </div>

            {previewOpen ? (
              <div className="min-h-[420px] rounded-lg border border-border bg-background p-5">
                <h1 className="mb-4 font-display text-2xl">{v.title || "Untitled post"}</h1>
                {v.content.trim() ? (
                  <div className="prose-decor">
                    <ReactMarkdown>{v.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nothing to preview yet — start writing above.</p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-2 flex flex-wrap gap-1" role="toolbar" aria-label="Formatting">
                  {mdTools.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={t.action}
                      title={t.label}
                      aria-label={t.label}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-sage hover:text-sage-deep"
                    >
                      <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt("Image URL (https://… or /uploads/…):");
                      if (url) applyMd("\n![Image alt text]", `(${url})\n`, "");
                    }}
                    title="Insert image"
                    aria-label="Insert image"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-sage hover:text-sage-deep"
                  >
                    <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <textarea
                  ref={contentRef}
                  rows={18}
                  value={v.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder={"Write your article in Markdown…\n\n## Start with a section heading\n\nWrite helpful, honest content. Use **bold** for emphasis and [links](https://example.com) to related finds."}
                  className={cn(inputClass, "min-h-[420px] resize-y font-mono text-[13px] leading-6")}
                />
              </>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="post-seo">
            <h2 id="post-seo" className="mb-1 text-sm font-semibold">SEO</h2>
            <p className="mb-4 text-xs text-muted-foreground">Leave empty to use the title and excerpt.</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="po-seotitle" className="text-sm font-medium">SEO title</label>
                  <span className={cn("text-xs tabular-nums", seoTitleLeft < 0 ? "text-destructive" : "text-muted-foreground")}>{seoTitleLeft} left</span>
                </div>
                <input id="po-seotitle" type="text" value={v.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="po-seodesc" className="text-sm font-medium">Meta description</label>
                  <span className={cn("text-xs tabular-nums", seoDescLeft < 0 ? "text-destructive" : "text-muted-foreground")}>{seoDescLeft} left</span>
                </div>
                <textarea id="po-seodesc" rows={3} value={v.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={inputClass} />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="post-publish">
            <h2 id="post-publish" className="mb-4 text-sm font-semibold">Publishing</h2>
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
                  <input type="radio" name="post-status" value={s} checked={v.status === s} onChange={() => set("status", s)} className="mt-0.5 accent-[var(--sage)]" />
                  <span>
                    <span className="block text-sm font-medium">{s === "DRAFT" ? "Draft" : "Published"}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {s === "DRAFT" ? "Only admins can preview it." : "Live on the blog with SEO metadata."}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="post-images">
            <h2 id="post-images" className="mb-4 text-sm font-semibold">Images</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="po-featimg" className="text-sm font-medium">Featured image URL</label>
                <input id="po-featimg" type="text" value={v.featuredImage} onChange={(e) => set("featuredImage", e.target.value)} placeholder="https://… or /uploads/…" className={cn(inputClass, "font-mono text-xs")} />
                <button
                  type="button"
                  onClick={() => {
                    setUploadTarget("featured");
                    fileRef.current?.click();
                  }}
                  disabled={uploading}
                  className="btn-outline w-full px-4 py-2 text-xs"
                >
                  {uploading && uploadTarget === "featured" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
                  Upload featured image
                </button>
                {v.featuredImage && (
                  <span className="relative mt-1 block aspect-[16/9] overflow-hidden rounded-md border border-border bg-secondary">
                    <SmartImage src={v.featuredImage} alt="Featured image preview" sizes="320px" />
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="po-alt" className="text-sm font-medium">Image alt text</label>
                <input id="po-alt" type="text" value={v.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} placeholder="Describe the featured image" className={inputClass} />
              </div>
              <div className="space-y-1.5 border-t border-border pt-4">
                <label htmlFor="po-pin" className="text-sm font-medium">Pinterest image <span className="text-xs text-muted-foreground">(2:3 recommended)</span></label>
                <input id="po-pin" type="text" value={v.pinterestImage} onChange={(e) => set("pinterestImage", e.target.value)} placeholder="https://… or /uploads/…" className={cn(inputClass, "font-mono text-xs")} />
                <button
                  type="button"
                  onClick={() => {
                    setUploadTarget("pinterest");
                    fileRef.current?.click();
                  }}
                  disabled={uploading}
                  className="btn-outline w-full px-4 py-2 text-xs"
                >
                  {uploading && uploadTarget === "pinterest" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
                  Upload Pinterest image
                </button>
                {v.pinterestImage && (
                  <span className="relative mt-1 block aspect-[2/3] w-24 overflow-hidden rounded-md border border-border bg-secondary">
                    <SmartImage src={v.pinterestImage} alt="Pinterest image preview" sizes="96px" />
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="post-meta">
            <h2 id="post-meta" className="mb-4 text-sm font-semibold">Details</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="po-category" className="text-sm font-medium">Blog category</label>
                <input id="po-category" type="text" list="post-category-suggestions" value={v.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Room Ideas" className={inputClass} />
                <datalist id="post-category-suggestions">
                  <option value="Room Ideas" />
                  <option value="Styling Guides" />
                  <option value="Decor Guides" />
                  <option value="Shopping Tips" />
                </datalist>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="po-tags" className="text-sm font-medium">Tags <span className="text-xs text-muted-foreground">(comma separated)</span></label>
                <input id="po-tags" type="text" value={v.tags} onChange={(e) => set("tags", e.target.value)} placeholder="living room, budget decor" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="po-author" className="text-sm font-medium">Author name</label>
                <input id="po-author" type="text" value={v.author} onChange={(e) => set("author", e.target.value)} className={inputClass} />
              </div>
            </div>
          </section>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f);
          e.target.value = "";
        }}
      />
    </form>
  );
}
