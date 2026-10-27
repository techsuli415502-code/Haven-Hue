import type { SiteSettings } from "@/lib/types";
import { Instagram, Facebook, Twitter, PinterestIcon } from "./social-icons";

/** Social links rendered from editable settings — hidden when unset. */
export function SocialLinks({
  settings,
  className = "flex items-center gap-3",
  iconClass = "h-4 w-4",
}: {
  settings: SiteSettings;
  className?: string;
  iconClass?: string;
}) {
  const links: { href: string; label: string; icon: React.ReactNode }[] = [];
  if (settings.pinterestUrl)
    links.push({ href: settings.pinterestUrl, label: "Pinterest", icon: <PinterestIcon className={iconClass} /> });
  if (settings.instagramUrl)
    links.push({ href: settings.instagramUrl, label: "Instagram", icon: <Instagram className={iconClass} /> });
  if (settings.facebookUrl)
    links.push({ href: settings.facebookUrl, label: "Facebook", icon: <Facebook className={iconClass} /> });
  if (settings.xTwitterUrl)
    links.push({ href: settings.xTwitterUrl, label: "X (Twitter)", icon: <Twitter className={iconClass} /> });

  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${l.label} (opens in a new tab)`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-sage hover:text-sage-deep"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
