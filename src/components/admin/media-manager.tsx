"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/data";
import { SmartImage } from "@/components/site/smart-image";
import type { Media } from "@/lib/types";

export function MediaManager() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok && data.ok) setMedia(data.media);
      else toast.error(data.error ?? "Failed to load media.");
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          toast.error(data.error ?? `Upload of ${file.name} failed.`);
        }
      }
      toast.success("Upload finished.");
      load();
    } catch {
      toast.error("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Copy failed — select the URL manually.");
    }
  };

  const del = async (m: Media) => {
    if (!window.confirm(`Delete ${m.filename}? Any content using this image will lose it.`)) return;
    try {
      const res = await fetch(`/api/admin/media/${m.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Deleted.");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Uploaded images are stored in <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/uploads</code> and can be used on any product or post.
        </p>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-sage px-4 py-2.5 text-xs">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          Upload images
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading media…
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Upload className="mb-3 h-10 w-10 text-sage/40" aria-hidden="true" />
          <p className="font-medium">No images yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Upload JPEG, PNG, WebP, GIF or AVIF images (max 5 MB each). You can also paste external image URLs directly in products and posts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {media.map((m) => (
            <figure key={m.id} className="group overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-square bg-secondary">
                <SmartImage src={m.url} alt={m.alt || m.filename} sizes="200px" />
              </div>
              <figcaption className="space-y-2 p-3">
                <p className="truncate text-xs font-medium" title={m.filename}>{m.filename}</p>
                <p className="text-[11px] text-muted-foreground">
                  {(m.size / 1024).toFixed(0)} KB · {formatDateTime(m.createdAt)}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(m.url)}
                    className="flex h-7 flex-1 items-center justify-center gap-1 rounded-md border border-border text-[11px] font-medium text-muted-foreground transition-colors hover:border-sage hover:text-sage-deep"
                    aria-label={`Copy URL for ${m.filename}`}
                  >
                    {copied === m.url ? <Check className="h-3 w-3 text-sage" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
                    {copied === m.url ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => del(m)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-destructive/70 transition-colors hover:bg-terracotta-soft hover:text-destructive"
                    aria-label={`Delete ${m.filename}`}
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
