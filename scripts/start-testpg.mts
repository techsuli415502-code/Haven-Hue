/**
 * Long-running embedded Postgres for the "database connected" smoke test.
 * Starts PG, prints READY, and stays alive until killed (SIGTERM/SIGINT).
 * Usage: node scripts/start-testpg.mjs
 */
import EmbeddedPostgres from "embedded-postgres";

const PORT = 55440;
const pg = new EmbeddedPostgres({
  databaseDir: "./.pgtest-live",
  user: "test",
  password: "testpw",
  port: PORT,
  persistent: true,
});

const shutdown = async () => {
  try { await pg.stop(); } catch {}
  process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

await pg.initialise();
await pg.start();
try { await pg.createDatabase("havenhue"); } catch {}
console.log(`READY postgresql://test:testpw@127.0.0.1:${PORT}/havenhue`);
process.stdout.write("");
// keep alive
setInterval(() => {}, 60_000);
