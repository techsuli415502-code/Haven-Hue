import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Never throw from the lazy getter: a synchronous throw at property-access
    // time escapes callers like safe(db.product.count(...)), which evaluates
    // its argument BEFORE safe() can try/catch it — crashing the dashboard on
    // deployments without a database. Instead, construct against a black-hole
    // datasource so every QUERY rejects with an ordinary connection error that
    // callers already catch (tryDb, safe, layout try/catch).
    console.warn(
      "[db] DATABASE_URL is not set — queries will fail and be caught. Connect a Postgres database (Vercel: Storage → Create Database) or set DATABASE_URL, then redeploy.",
    );
    return new PrismaClient({
      datasourceUrl:
        "postgresql://placeholder:placeholder@127.0.0.1:9/placeholder?connect_timeout=1&pool_timeout=1&connection_limit=1",
    });
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
