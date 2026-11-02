import { ok, fail, originChecked, getClientIp, readJson, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import {
  verifyPassword,
  createSession,
  verifyEnvAdmin,
  createEnvSession,
  envAdminCredentials,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

/**
 * Admin login.
 * - Rate limited per IP AND per email (10 attempts / 10 min) to blunt brute force.
 * - Generic error messages avoid revealing whether an account exists.
 * - Creates a database-backed session referenced by an HttpOnly cookie.
 */
export async function POST(req: Request) {
  const csrf = originChecked(req);
  if (csrf) return csrf;

  const ip = getClientIp(req);

  const body = await readJson(req);
  if (!body) return fail(400, "Invalid request body.");

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return fail(400, zodMessage(parsed));

  const { email, password } = parsed.data;

  const ipLimit = rateLimit(`admin:login:ip:${ip}`, 10, 10 * 60 * 1000);
  const emailLimit = rateLimit(`admin:login:email:${email}`, 10, 10 * 60 * 1000);
  if (!ipLimit.ok || !emailLimit.ok) {
    const wait = Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds);
    return fail(429, `Too many login attempts. Please try again in ${wait} seconds.`);
  }

  // Try the database first. If the database is not connected yet (fresh Vercel
  // project before Storage → Create Database), fall back to the ADMIN_EMAIL /
  // ADMIN_PASSWORD environment credentials so the owner is never locked out.
  let admin: { id: string; name: string; email: string; passwordHash: string } | null = null;
  let dbUnavailable = false;
  try {
    admin = await db.adminUser.findUnique({ where: { email } });
  } catch {
    dbUnavailable = true;
  }

  if (admin) {
    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return fail(401, "Incorrect email or password.");
    }

    await createSession(admin.id, {
      ip,
      userAgent: req.headers.get("user-agent"),
    });

    return ok({ admin: { name: admin.name, email: admin.email } });
  }

  if (dbUnavailable) {
    if (await verifyEnvAdmin(email, password)) {
      await createEnvSession(email);
      const creds = envAdminCredentials();
      return ok({ admin: { name: creds?.name ?? "Site Admin", email }, demoSession: true });
    }

    // Distinguish the two failure modes so the owner is never misled:
    if (!envAdminCredentials()) {
      // No ADMIN_EMAIL / ADMIN_PASSWORD configured on this deployment at all.
      return fail(
        503,
        "One-time setup needed: the database is not connected and no admin environment variables are configured on this deployment.",
        { setupRequired: true },
      );
    }
    // Env credentials exist, but what was typed doesn't match them.
    return fail(
      401,
      "Incorrect email or password. This deployment signs in with the ADMIN_EMAIL / ADMIN_PASSWORD environment variables — if you changed them in Vercel (Settings → Environment Variables) you must redeploy first, then sign in with those exact values.",
    );
  }

  return fail(401, "Incorrect email or password.");
}
