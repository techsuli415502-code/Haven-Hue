import { withAdmin, ok, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

/** Mark a contact message as read/unread. */
export async function PATCH(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const read = Boolean((body as { read?: boolean }).read);

    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) return notFound("Message");

    const message = await db.contactMessage.update({ where: { id }, data: { read } });
    return ok({ message });
  });
}

/** Delete a contact message. */
export async function DELETE(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) return notFound("Message");

    await db.contactMessage.delete({ where: { id } });
    return ok({ message: "Message deleted." });
  });
}
