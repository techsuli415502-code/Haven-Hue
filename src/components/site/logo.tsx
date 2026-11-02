import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";

/**
 * Brand lockup: logo mark + wordmark.
 * The ampersand is rendered in italic terracotta — a small editorial flourish
 * that echoes the "hue" in the brand name. A custom logoUrl (set in admin
 * Settings) always wins over the built-in mark.
 */
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
  const segments = siteName.split(" & ");

  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label={`${siteName} — home`}>
      {logoUrl ? (
        <span className="relative block h-9 w-9 overflow-hidden rounded-full ring-1 ring-border/60 transition-transform duration-300 group-hover:scale-105">
          <img src={logoUrl} alt={`${siteName} logo`} className="h-full w-full object-cover" />
        </span>
      ) : (
        <span className="transition-transform duration-300 group-hover:scale-105">
          <LogoMark
            className={variant === "light" ? "h-9 w-9 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" : "h-9 w-9"}
          />
        </span>
      )}
      <span
        className={cn(
          "font-display text-[1.35rem] font-semibold leading-none tracking-tight",
          variant === "light" ? "text-[#f6f3ea]" : "text-foreground",
        )}
      >
        {segments.length === 2 ? (
          <>
            {segments[0]}{" "}
            <span className={cn("font-normal italic", variant === "light" ? "text-[#d8a48f]" : "text-terracotta")}>
              &
            </span>{" "}
            {segments[1]}
          </>
        ) : (
          siteName
        )}
      </span>
    </Link>
  );
}
