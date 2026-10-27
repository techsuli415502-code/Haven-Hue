import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  siteName,
  logoUrl,
  className,
  variant = "default",
}: {
  siteName: string;
  logoUrl?: string | null;
  className?: string;
  variant?: "default" | "light";
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${siteName} — home`}>
      {logoUrl ? (
        <span className="relative block h-9 w-9 overflow-hidden rounded-full">
          <img src={logoUrl} alt={`${siteName} logo`} className="h-full w-full object-cover" />
        </span>
      ) : (
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            variant === "light" ? "bg-white/15 text-white" : "bg-sage text-white",
          )}
        >
          <Home className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <span
        className={cn(
          "font-display text-xl font-semibold tracking-tight",
          variant === "light" ? "text-white" : "text-foreground",
        )}
      >
        {siteName}
      </span>
    </Link>
  );
}
