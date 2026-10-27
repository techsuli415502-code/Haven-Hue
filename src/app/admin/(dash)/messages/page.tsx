import { InboxManager } from "@/components/admin/inbox-manager";

export const metadata = { title: "Inbox" };

export default function AdminInboxPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form messages and newsletter subscribers — all stored in your database.
        </p>
      </header>
      <InboxManager />
    </div>
  );
}
