import { ok, fail, readJson, zodMessage, withAdmin } from "@/lib/admin-guard";
import { hashPassword, verifyPassword, destroyOtherSessions } from "@/lib/auth";
import { passwordChangeSchema } from "@/lib/validators";
import { db } from "@/lib/db";

/**
 * Change the signed-in admin's password.
 * - Requires the current password.
 * - Minimum 8 characters.
 * - All other sessions are invalidated after the change.
 */
export async function PUT(req: Request) {
  return withAdmin(req, async (user) => {
    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));

    const { currentPassword, newPassword } = parsed.data;

    const admin = await db.adminUser.findUnique({ where: { id: user.id } });
    if (!admin) return fail(404, "Account not found.");

    const valid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!valid) return fail(401, "Your current password is incorrect.");

    if (await verifyPassword(newPassword, admin.passwordHash)) {
      return fail(400, "New password must be different from the current one.");
    }

    const passwordHash = await hashPassword(newPassword);
    await db.adminUser.update({ where: { id: user.id }, data: { passwordHash } });
    await destroyOtherSessions(user.id);

    return ok({ message: "Password updated. Other sessions have been signed out." });
  });
}
