import { ok, fail, originChecked, getClientIp, readJson, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { hashPassword, getAdminCount } from "@/lib/auth";
import { setupSchema } from "@/lib/validators";

/**
 * One-time initial admin setup.
 * - Only works while the database contains zero admin accounts.
 * - Rate limited (10 attempts / 10 min / IP).
 * - After the first admin exists, this endpoint permanently refuses to run.
 */
export async function POST(req: Request) {
  const csrf = originChecked(req);
  if (csrf) return csrf;

  const limit = rateLimit(`admin:setup:${getClientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return fail(429, `Too many attempts. Please try again in ${limit.retryAfterSeconds} seconds.`);
  }

  const count = await getAdminCount();
  if (count > 0) {
    return fail(403, "Setup is disabled: an administrator already exists. Please sign in instead.");
  }

  const body = await readJson(req);
  if (!body) return fail(400, "Invalid request body.");

  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) return fail(400, zodMessage(parsed));

  const { name, email, password } = parsed.data;

  // Re-check inside the create path to close the race window.
  const existing = await db.adminUser.count();
  if (existing > 0) {
    return fail(403, "Setup is disabled: an administrator already exists. Please sign in instead.");
  }

  const passwordHash = await hashPassword(password);
  const admin = await db.adminUser.create({
    data: { name, email, passwordHash },
    select: { id: true, email: true, name: true },
  });

  return ok({ admin, message: "Administrator account created. Please sign in." });
}
