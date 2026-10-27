import { NextResponse } from "next/server";

/** Standard JSON success response. */
export function ok(data: Record<string, unknown> = {}, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data }, init);
}

/** Standard JSON error response. */
export function fail(status: number, error: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

export const unauthorized = () => fail(401, "You must be signed in as an administrator to do that.");
export const forbidden = () => fail(403, "You do not have permission to perform this action.");
export const notFound = (what = "Resource") => fail(404, `${what} not found.`);
export const badRequest = (error: string) => fail(400, error);

/**
 * CSRF protection: for state-changing requests, verify that the Origin header
 * (sent automatically by browsers) matches the Host that served the request.
 * Combined with SameSite=Lax session cookies this blocks cross-site form posts.
 *
 * Behind a reverse proxy (preview gateway, Vercel, Nginx, Caddy...) the public
 * hostname travels in `x-forwarded-host` while `host` holds the internal
 * upstream address — so both are accepted. This is the same convention used by
 * NextAuth and the WHATWG Forwarded header standard; browsers cannot be tricked
 * into sending a foreign Origin, so cross-site posts remain blocked.
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser client (curl, server-to-server)

  let originHost: string;
  try {
    originHost = new URL(origin).host; // scheme-stripped, so http/https mismatches don't matter
  } catch {
    return false;
  }

  const candidates = new Set<string>();
  const add = (v: string | null) => {
    if (!v) return;
    const h = v.trim().toLowerCase();
    if (h) candidates.add(h);
  };
  add(req.headers.get("host"));
  // Standard + common reverse-proxy headers carrying the public hostname.
  for (const part of (req.headers.get("x-forwarded-host") ?? "").split(",")) add(part);
  add(req.headers.get("x-original-host"));
  add(req.headers.get("x-host"));
  // RFC 7239 Forwarded: e.g. `host=preview-abc.space-z.ai;proto=https`
  const fwd = req.headers.get("forwarded");
  if (fwd) {
    for (const m of fwd.matchAll(/host=([^;,\s]+)/gi)) add(m[1]);
  }
  if (candidates.size === 0) return false;

  if (candidates.has(originHost.toLowerCase())) return true;

  // Operator-configured trusted public origins (e.g. behind gateways that strip
  // all forwarded headers). Set TRUSTED_ORIGINS="host1,host2" in the environment.
  const trusted = (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => {
      const t = s.trim().toLowerCase();
      if (!t) return "";
      try {
        return t.includes("://") ? new URL(t).host : t;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  if (trusted.includes(originHost.toLowerCase())) return true;

  // TODO-REMOVE(diagnostic): log mismatches so proxied environments can be debugged
  console.log(
    "[CSRF-MISMATCH]",
    JSON.stringify({
      origin,
      host: req.headers.get("host"),
      xfh: req.headers.get("x-forwarded-host"),
      xoh: req.headers.get("x-original-host"),
      xh: req.headers.get("x-host"),
      forwarded: req.headers.get("forwarded"),
      referer: req.headers.get("referer"),
      ua: req.headers.get("user-agent")?.slice(0, 60),
    }),
  );
  return false;
}

export function originChecked(req: Request): NextResponse | null {
  if (!sameOrigin(req)) {
    return fail(403, "Request blocked: cross-origin request rejected.");
  }
  return null;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function readJson<T = unknown>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** Extract the first human-readable message from a Zod safeParse error. */
export function zodMessage(result: { success: boolean; error?: { issues: { message: string }[] } }): string {
  return result.error?.issues?.[0]?.message ?? "Invalid input.";
}
