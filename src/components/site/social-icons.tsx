/** Inline brand-styled social SVG icons (Lucide lacks official brand icons). */

export function PinterestIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.62 2 3.23 5.75 3.23 9.9c0 1.91.7 3.61 2.2 4.75.28.21.36.44.28.77l-.45 1.67c-.06.24-.2.31-.45.19-1.55-.72-2.51-3-2.51-4.9 0-4.06 3.32-7.95 9.24-7.95 4.94 0 8.28 3.46 8.28 7.75 0 5.19-3.1 8.98-7.3 8.98-1.47 0-2.85-.77-3.32-1.68l-.9 3.55c-.33 1.24-1.21 2.8-1.8 3.76 1.36.4 2.8.62 4.29.62 6.63 0 12-5.37 12-12 0-6.62-5.37-12-12-12z" />
    </svg>
  );
}

export function Instagram({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Facebook({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.957-.14C11.686 2 9.937 3.658 9.937 6.6v2.9H7v4h2.937V22h4.063v-8.5z" />
    </svg>
  );
}

export function Twitter({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
