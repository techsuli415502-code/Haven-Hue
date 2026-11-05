import { cn } from "@/lib/utils";

/**
 * Haven & Hue brand mark.
 *
 * A rounded square in sage holds an arched window (the "haven") with a
 * botanical sprig growing inside and a terracotta sun (the "hue") above it.
 * Pure geometry — stays crisp from 16px favicon to footer scale.
 */
export function LogoMark({ className, title = "Haven & Hue logo" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("h-9 w-9 shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hh-arch" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#71805f" />
          <stop offset="1" stopColor="#4e5c44" />
        </linearGradient>
      </defs>
      {/* rounded-square backdrop */}
      <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#hh-arch)" />
      <rect x="3.5" y="3.5" width="57" height="57" rx="13.5" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
      {/* arched window */}
      <path d="M20 52 V32 a12 12 0 0 1 24 0 V52 Z" fill="#fbf9f4" />
      {/* terracotta sun */}
      <circle cx="32" cy="26.5" r="3.2" fill="#b4533c" />
      {/* sprig */}
      <path d="M32 50 C32 44 32 40 32 35" stroke="#55634a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M32 40 C27 39 24.5 36 24 31.5 C28.5 32 31.5 35 32 40 Z" fill="#6c7a5d" />
      <path d="M32 44 C37 43 39.5 40 40 35.5 C35.5 36 32.5 39 32 44 Z" fill="#6c7a5d" />
      {/* ground line */}
      <path d="M25.5 51 H38.5" stroke="#55634a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
