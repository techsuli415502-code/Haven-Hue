"use client";

import { useState } from "react";
import { SmartImage } from "./smart-image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/60 bg-secondary">
        <SmartImage src={current} alt={alt} priority sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="Product images">
          {list.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 bg-secondary transition-colors",
                i === active ? "border-sage" : "border-transparent hover:border-border",
              )}
            >
              <SmartImage src={img} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
