"use client";

import { useState } from "react";
import { Check, Copy, Facebook, Link2, Send } from "lucide-react";
import { PinterestIcon } from "./social-icons";

/**
 * Social share buttons. Pinterest uses the dedicated (2:3 friendly) pin image
 * when one is set, falling back to the main image — ideal for Pinterest traffic.
 */
export function ShareButtons({
  url,
  title,
  imageUrl,
  description,
}: {
  url: string;
  title: string;
  imageUrl?: string | null;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description ?? title);

  const pinterestHref = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
    imageUrl ?? url,
  )}&description=${encodedDesc}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore silently
    }
  };

  const base =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-sage hover:text-sage-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage";

  return (
    <div className="flex items-center gap-2" aria-label="Share this page">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share</span>
      <a href={pinterestHref} target="_blank" rel="noopener noreferrer" className={base} aria-label="Share on Pinterest (opens in a new tab)">
        <PinterestIcon className="h-4 w-4" />
      </a>
      <a href={facebookHref} target="_blank" rel="noopener noreferrer" className={base} aria-label="Share on Facebook (opens in a new tab)">
        <Facebook className="h-4 w-4" />
      </a>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={base} aria-label="Share on X (opens in a new tab)">
        <Send className="h-4 w-4" />
      </a>
      <button type="button" onClick={copyLink} className={base} aria-label="Copy page link">
        {copied ? <Check className="h-4 w-4 text-sage" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
