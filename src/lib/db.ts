import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Connect a Postgres database (on Vercel: Project → Storage → Create Database → Postgres, it wires the env var automatically) or set DATABASE_URL manually, then redeploy.",
    );
  }
  return new PrismaClient();
}

/**
 * Lazy Prisma singleton.
 *
 * The client is created on the FIRST QUERY, not at module import. This keeps
 * `next build` working even when no database is configured yet (Vercel static
 * export of /_not-found and /admin/login evaluates the root layout, which
 * imports this module). Without laziness the build crashes with
 * "Environment variable not found: DATABASE_URL".
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
    const client = globalForPrisma.prisma;
    const value = Reflect.get(client, prop) as unknown;
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});
