import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

/**
 * Server-side authentication for the admin dashboard.
 *
 * - Passwords are hashed with bcrypt (cost 12) — never stored or logged in plain text.
 * - Sessions are random 48-byte tokens; only their SHA-256 hash is stored in the database.
 * - The raw token lives exclusively in an HttpOnly, SameSite=Lax cookie.
 * - Sessions expire after 7 days and are validated against the database on every request.
 */

export const SESSION_COOKIE = "hh_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
};

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createSession(
  userId: string,
  meta?: { ip?: string | null; userAgent?: string | null },
): Promise<void> {
  const token = crypto.randomBytes(48).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent?.slice(0, 300) ?? null,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  // Opportunistic cleanup of expired sessions.
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => undefined);
}

export async function getSessionUser(): Promise<AdminSessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }

  return { id: session.user.id, email: session.user.email, name: session.user.name };
}

/** For API routes: returns the logged-in admin or null. */
export async function requireAdmin(): Promise<AdminSessionUser | null> {
  try {
    return await getSessionUser();
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: sha256(token) } }).catch(() => undefined);
  }
  store.delete(SESSION_COOKIE);
}

/** Destroy every session for a user except the current one (used after a password change). */
export async function destroyOtherSessions(userId: string): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const currentHash = token ? sha256(token) : "";
  await db.session
    .deleteMany({ where: { userId, tokenHash: { not: currentHash } } })
    .catch(() => undefined);
}

export async function getAdminCount(): Promise<number> {
  return db.adminUser.count();
}
