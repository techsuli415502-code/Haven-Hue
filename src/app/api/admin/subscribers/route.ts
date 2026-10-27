import { withAdmin, ok } from "@/lib/admin-guard";
import { db } from "@/lib/db";

/** List newsletter subscribers (newest first). */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    return ok({ subscribers });
  });
}
