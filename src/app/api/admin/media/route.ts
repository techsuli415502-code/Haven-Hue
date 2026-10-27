import { withAdmin, ok } from "@/lib/admin-guard";
import { db } from "@/lib/db";

/** List the media library, newest first. */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });
    return ok({ media });
  });
}
