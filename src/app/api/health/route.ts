import { isDatabaseUp } from "@/lib/content";

/**
 * Lightweight health probe.
 * GET /api/health → { ok, db: "up" | "down", ... }
 * The site serves bundled demo content when the database is down, so this
 * endpoint reports the database state for quick diagnosis.
 */
export async function GET() {
  const startedAt = Date.now();
  const up = await isDatabaseUp();
  return Response.json(
    {
      ok: true,
      db: up ? "up" : "down",
      contentMode: up ? "database" : "demo-fallback",
      latencyMs: Date.now() - startedAt,
      time: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
