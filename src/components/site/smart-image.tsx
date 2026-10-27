"use client";

import { useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper that degrades gracefully: empty or broken image URLs
 * render a warm branded placeholder instead of a broken-image icon.
 * The parent must be `position: relative` and sized (the image uses fill).
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-secondary text-sage/60",
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <Leaf className="h-10 w-10" strokeWidth={1.25} aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-secondary" aria-hidden="true" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
