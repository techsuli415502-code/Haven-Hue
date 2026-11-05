import { isDatabaseUp } from "@/lib/content";
import { isDemoFallbackActive } from "@/lib/auth";

/**
 * Lightweight health probe.
 * GET /api/health → { ok, db: "up" | "down", ... }
 * The site serves bundled demo content when the database is down, so this
 * endpoint reports the database state for quick diagnosis. `demoLogin` tells
 * the login page when the pre-filled demo owner account is available.
 */
export async function GET() {
  const startedAt = Date.now();
  const up = await isDatabaseUp();
  return Response.json(
    {
      ok: true,
      db: up ? "up" : "down",
      contentMode: up ? "database" : "demo-fallback",
      demoLogin: !up && isDemoFallbackActive(),
      latencyMs: Date.now() - startedAt,
      time: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
