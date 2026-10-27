import { withAdmin, ok } from "@/lib/admin-guard";
import { db } from "@/lib/db";

/** List contact messages (newest first) with subscriber count for the inbox tabs. */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return ok({ messages });
  });
}
