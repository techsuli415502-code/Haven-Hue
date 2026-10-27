import { db } from "@/lib/db";
import { ok, fail, originChecked, getClientIp, readJson, zodMessage } from "@/lib/api";
import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { getSettings } from "@/lib/settings";

/**
 * Public contact endpoint.
 * - Input validated with Zod; honeypot field must stay empty.
 * - Rate limited per IP (5 messages / hour).
 * - The message is saved to the database and visible in the admin inbox.
 * - If RESEND_API_KEY is configured, an email notification is also sent;
 *   otherwise the response honestly says the message was saved (no fake "email sent").
 */
export async function POST(req: Request) {
  const csrf = originChecked(req);
  if (csrf) return csrf;

  const limit = rateLimit(`contact:${getClientIp(req)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return fail(429, `Too many messages sent. Please try again in ${limit.retryAfterSeconds} seconds.`);
  }

  const body = await readJson(req);
  if (!body) return fail(400, "Invalid request body.");

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return fail(400, zodMessage(parsed));
  if (parsed.data.website) return fail(400, "Spam detected."); // honeypot tripped

  const { name, email, subject, message } = parsed.data;

  const saved = await db.contactMessage.create({
    data: { name, email, subject, message },
  });

  // Optional email delivery via Resend when an API key is configured.
  let emailNote = "";
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const settings = await getSettings();
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
          to: settings.contactEmail,
          reply_to: email,
          subject: `[Contact] ${subject}`,
          text: `From: ${name} <${email}>\n\n${message}\n\n(message id ${saved.id})`,
        }),
      });
      if (res.ok) emailNote = " An email notification has been sent to the site owner.";
    } catch {
      // Email delivery is best-effort; the message is safely stored either way.
    }
  }

  return ok({
    message: `Thanks, ${name.split(" ")[0]}! Your message has been received and saved. We typically reply within 2 business days to ${email}.${emailNote}`,
  });
}
