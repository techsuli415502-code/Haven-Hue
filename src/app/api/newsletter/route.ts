import { db } from "@/lib/db";
import { ok, fail, originChecked, getClientIp, readJson, zodMessage } from "@/lib/api";
import { newsletterSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { getSettings } from "@/lib/settings";

/**
 * Public newsletter signup.
 * - Validates and stores the email in the database (subscribers visible in the admin).
 * - Rate limited per IP (5 signups / hour).
 * - Honest messaging: the address is saved for the site owner; no delivery claims.
 */
export async function POST(req: Request) {
  const csrf = originChecked(req);
  if (csrf) return csrf;

  const limit = rateLimit(`newsletter:${getClientIp(req)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return fail(429, `Too many attempts. Please try again in ${limit.retryAfterSeconds} seconds.`);
  }

  const settings = await getSettings();
  if (!settings.newsletterEnabled) {
    return fail(403, "The newsletter is currently unavailable.");
  }

  const body = await readJson(req);
  if (!body) return fail(400, "Invalid request body.");

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return fail(400, zodMessage(parsed));

  const email = parsed.data.email;

  const existing = await db.subscriber.findUnique({ where: { email } });
  if (!existing) {
    await db.subscriber.create({ data: { email } });
    return ok({ message: "You're on the list! Fresh decor ideas will land in your inbox soon." });
  }

  return ok({ message: "You're already subscribed — no need to sign up twice. Happy decorating!" });
}
