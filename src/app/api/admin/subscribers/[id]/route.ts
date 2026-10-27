import { withAdmin, ok, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

/** Remove a newsletter subscriber. */
export async function DELETE(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.subscriber.findUnique({ where: { id } });
    if (!existing) return notFound("Subscriber");

    await db.subscriber.delete({ where: { id } });
    return ok({ message: `Removed ${existing.email}.` });
  });
}
