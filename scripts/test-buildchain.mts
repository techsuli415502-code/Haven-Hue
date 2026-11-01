/**
 * End-to-end test of the Vercel build chain (npm run db:setup) against embedded Postgres.
 * Mirrors vercel.json: "prisma generate && npm run db:setup && next build".
 * Usage: npx tsx scripts/test-buildchain.mts [--nodb]
 *   --nodb : also verify the "no database configured" path exits 0 with a WARN.
 */
import EmbeddedPostgres from "embedded-postgres";
import { spawnSync } from "node:child_process";

const PORT = 55434;
const DIRECT = `postgresql://test:testpw@127.0.0.1:${PORT}/havenhue`;
const cwd = new URL("..", import.meta.url).pathname;

function run(label: string, env: Record<string, string>) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync("npm", ["run", "db:setup"], {
    env: { ...process.env, ...env },
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  });
  const out = ((r.stdout || "") + (r.stderr || "")).trim().split("\n").slice(-5).join("\n");
  console.log(out);
  return r.status;
}

const pg = new EmbeddedPostgres({
  databaseDir: "./.pgtest-chain",
  user: "test",
  password: "testpw",
  port: PORT,
  persistent: false,
});

try {
  await pg.initialise();
  await pg.start();
  await pg.createDatabase("havenhue");
  console.log("PG-UP on port", PORT);

  // success path: DATABASE_URL is the accelerate-style URL, DIRECT_DATABASE_URL is the real one
  const s = run("db:setup with DIRECT_DATABASE_URL (Prisma Postgres style)", {
    DATABASE_URL: "prisma+postgres://accelerate.prisma-data.net/?api_key=fake",
    DIRECT_DATABASE_URL: DIRECT,
  });
  if (s !== 0) throw new Error(`setup failed, exit ${s}`);

  // verify seeded rows through the real (direct) URL
  process.env.DATABASE_URL = DIRECT;
  const { PrismaClient } = await import("@prisma/client");
  const client = new PrismaClient();
  const [c, p, b, st] = await Promise.all([
    client.category.count(),
    client.product.count(),
    client.post.count(),
    client.setting.count(),
  ]);
  console.log(`\ncounts => categories:${c} products:${p} posts:${b} settings:${st}`);
  if (c < 1 || p < 1 || b < 1 || st < 1) throw new Error("row counts too low");
  await client.$disconnect();

  if (process.argv.includes("--nodb")) {
    const s2 = run("db:setup with NO database (expect WARN + exit 0)", {
      DATABASE_URL: "",
      DIRECT_DATABASE_URL: "",
    });
    if (s2 !== 0) throw new Error(`no-db path must exit 0, got ${s2}`);
  }

  console.log("\nCHAIN-OK");
} finally {
  try { await pg.stop(); } catch {}
  spawnSync("rm", ["-rf", ".pgtest-chain"], { cwd });
}
console.log("ALL-GREEN");
