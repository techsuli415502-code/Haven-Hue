import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

/**
 * Protected dashboard layout. Every request re-validates the session against
 * the database — logged-out users are redirected to /admin/login. This is the
 * real server-side guard; the client shell is only presentation.
 */
export default async function AdminDashLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const settings = await getSettings();
  const unreadCount = await db.contactMessage.count({ where: { read: false } });

  return (
    <AdminShell user={user} siteName={settings.siteName} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
