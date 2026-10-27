import { unlink } from "fs/promises";
import path from "path";
import { withAdmin, ok, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

/** Delete a media entry; local uploads are also removed from disk. */
export async function DELETE(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const media = await db.media.findUnique({ where: { id } });
    if (!media) return notFound("Media");

    if (media.url.startsWith("/uploads/")) {
      const safeName = path.basename(media.url);
      await unlink(path.join(process.cwd(), "public", "uploads", safeName)).catch(() => undefined);
    }

    await db.media.delete({ where: { id } });
    return ok({ message: `Deleted ${media.filename}.` });
  });
}
