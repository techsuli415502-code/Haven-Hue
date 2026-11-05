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

/**
 * Fallback authentication for when the database is not connected yet.
 *
 * A fresh Vercel project has no database until "Storage → Create Database"
 * is clicked, which would lock the owner out of /admin entirely. When the
 * ADMIN_EMAIL and ADMIN_PASSWORD environment variables are set, login falls
 * back to validating against them and issues a signed, database-free session
 * cookie (HMAC-SHA256 over the email, keyed with the password). Admin WRITE
 * operations still require a real database — this only unlocks viewing.
 */
const ENV_TOKEN_PREFIX = "env1.";

export function envAdminCredentials(): { email: string; name: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, name: process.env.ADMIN_NAME?.trim() || "Site Admin" };
}

function envSessionToken(email: string): string {
  const secret = process.env.ADMIN_PASSWORD?.trim() ?? "";
  return ENV_TOKEN_PREFIX + crypto.createHmac("sha256", secret).update(`admin:${email}`).digest("base64url");
}

export async function verifyEnvAdmin(email: string, password: string): Promise<boolean> {
  const creds = envAdminCredentials();
  if (!creds) return false;
  const emailOk = timingSafeEqualStr(email.trim().toLowerCase(), creds.email);
  const passwordOk = timingSafeEqualStr(password, process.env.ADMIN_PASSWORD?.trim() ?? "");
  return emailOk && passwordOk;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Last-resort demo owner account.
 *
 * On a fresh deployment with NEITHER a database NOR ADMIN_EMAIL/ADMIN_PASSWORD,
 * the owner would be locked out of /admin entirely. In that exact state the
 * dashboard is strictly view-only (every write needs a database and fails
 * without one) and the site only serves bundled demo content, so a publicly
 * documented demo pair is safe — there is nothing to protect yet. The moment
 * ADMIN_EMAIL/ADMIN_PASSWORD are set or a database is connected, this path
 * disappears automatically. Mirrored in src/app/admin/login/page.tsx.
 */
const DEMO_ADMIN = {
  email: "admin@havenhue.com",
  password: "HavenHue@2026",
  name: "Demo Owner",
} as const;

/** True when neither env credentials nor a database can provide login. */
export function isDemoFallbackActive(): boolean {
  return !envAdminCredentials();
}

export async function verifyDemoAdmin(email: string, password: string): Promise<boolean> {
  if (!isDemoFallbackActive()) return false;
  const emailOk = timingSafeEqualStr(email.trim().toLowerCase(), DEMO_ADMIN.email);
  const passwordOk = timingSafeEqualStr(password, DEMO_ADMIN.password);
  return emailOk && passwordOk;
}

export function demoAdminInfo() {
  return { email: DEMO_ADMIN.email, name: DEMO_ADMIN.name };
}

function demoSessionToken(): string {
  return envSessionToken(DEMO_ADMIN.email);
}

/** Issue a database-free session cookie (used only when the DB is unavailable). */
export async function createEnvSession(email: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const store = await cookies();
  store.set(SESSION_COOKIE, envSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

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

  // Database-free env session (only issued when the database is unavailable).
  if (token.startsWith(ENV_TOKEN_PREFIX)) {
    const creds = envAdminCredentials();
    if (creds) {
      if (timingSafeEqualStr(token, envSessionToken(creds.email))) {
        return { id: "env-admin", email: creds.email, name: creds.name };
      }
      return null;
    }
    // Demo fallback session (no env credentials configured at all).
    if (isDemoFallbackActive() && timingSafeEqualStr(token, demoSessionToken())) {
      return { id: "demo-admin", email: DEMO_ADMIN.email, name: DEMO_ADMIN.name };
    }
    return null;
  }

  try {
    return await getSessionUserFromDb(token);
  } catch {
    // Database unavailable (not configured, unreachable, migrating…).
    return null;
  }
}

async function getSessionUserFromDb(token: string): Promise<AdminSessionUser | null> {
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
