import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl =
    settings.siteUrl.trim() ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() ||
    "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.defaultSeoTitle || settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultSeoDescription || settings.siteDescription,
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title: settings.defaultSeoTitle || settings.siteName,
      description: settings.defaultSeoDescription || settings.siteDescription,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeoTitle || settings.siteName,
      description: settings.defaultSeoDescription || settings.siteDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> (not body) so the base-layer h1–h4 rule,
    // which resolves --font-fraunces at :root scope, actually finds them.
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
