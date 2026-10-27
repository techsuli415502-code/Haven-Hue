import "server-only";
import { db } from "@/lib/db";
import { fail, originChecked } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/auth";

// Re-export shared API helpers so admin routes can import everything from one place.
export {
  ok,
  fail,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  sameOrigin,
  originChecked,
  getClientIp,
  readJson,
  zodMessage,
} from "@/lib/api";

/**
 * Shared helper for admin API routes.
 * Verifies (1) the request origin (CSRF) and (2) a valid admin session,
 * then runs the handler with the authenticated user.
 */
export async function withAdmin(
  req: Request,
  handler: (user: { id: string; email: string; name: string }) => Promise<Response>,
): Promise<Response> {
  const csrf = originChecked(req);
  if (csrf) return csrf;

  const user = await requireAdmin();
  if (!user) return fail(401, "You must be signed in as an administrator to do that.");

  return handler(user);
}

/** Rate-limit helper for sensitive admin endpoints (login, setup, password). */
export function adminRateLimit(req: Request, scope: string): Response | null {
  const result = rateLimit(`admin:${scope}:${getClientIp(req)}`, 10, 10 * 60 * 1000);
  if (!result.ok) {
    return fail(429, `Too many attempts. Please try again in ${result.retryAfterSeconds} seconds.`);
  }
  return null;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
