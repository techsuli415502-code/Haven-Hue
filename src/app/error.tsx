"use client";

import Link from "next/link";
import { Database, House, RotateCw } from "lucide-react";

/**
 * Route-level error boundary.
 *
 * The most common cause on a fresh deployment is a missing database: content
 * pages query Postgres, and without DATABASE_URL (or before the first
 * successful "db push") Prisma throws at runtime. This boundary replaces the
 * default white "Application error" screen with a branded, actionable page.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== "undefined") {
    console.error("[route error]", error.message, error.digest);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-sage-deep">
        <Database className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="eyebrow mb-3">Almost there</p>
      <h1 className="font-display text-4xl font-medium sm:text-5xl">
        The shop is still being furnished
      </h1>
      <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
        This page needs the site database, which isn&apos;t connected yet.
        <br />
        <span className="text-sm">
          Site owner: open your Vercel project → <strong>Storage</strong> →{" "}
          <strong>Create Database</strong> → Postgres, connect it to this
          project, then hit <strong>Redeploy</strong>. Everything sets itself up
          automatically.
        </span>
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="btn-sage inline-flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        <Link href="/" className="btn-outline inline-flex items-center gap-2">
          <House className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
      {error?.digest ? (
        <p className="mt-6 text-xs text-muted-foreground/70">
          Error ref: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
