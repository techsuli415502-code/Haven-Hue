import type { Metadata } from "next";

/**
 * Root layout for everything under /admin.
 * Login and setup pages render standalone; the dashboard chrome lives in
 * app/admin/(dash)/layout.tsx which additionally enforces authentication.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
