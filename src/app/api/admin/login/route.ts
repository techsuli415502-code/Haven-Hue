import { ok, fail, originChecked, getClientIp, readJson, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { verifyPassword, createSession } from "@/lib/auth";
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

  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return fail(401, "Incorrect email or password.");
  }

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
