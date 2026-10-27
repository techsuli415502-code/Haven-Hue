"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, Loader2, Mail, MailOpen, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ContactMessage, Subscriber } from "@/lib/types";

export function InboxManager() {
  const [tab, setTab] = useState<"messages" | "subscribers">("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMessage, setOpenMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [msgRes, subRes] = await Promise.all([
        fetch("/api/admin/messages"),
        fetch("/api/admin/subscribers").catch(() => null),
      ]);
      const msgData = await msgRes.json();
      if (msgRes.ok && msgData.ok) setMessages(msgData.messages);
      if (subRes?.ok) {
        const subData = await subRes.json();
        if (subData.ok) setSubscribers(subData.subscribers);
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (m: ContactMessage) => {
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !m.read }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)));
      } else {
        toast.error("Update failed.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const deleteMessage = async (m: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success("Message deleted.");
        load();
      } else {
        toast.error(data.error ?? "Delete failed.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const removeSubscriber = async (s: Subscriber) => {
    if (!window.confirm(`Remove ${s.email} from the newsletter?`)) return;
    try {
      const res = await fetch(`/api/admin/subscribers/${s.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message ?? "Removed.");
        load();
      } else {
        toast.error(data.error ?? "Remove failed.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="tablist" aria-label="Inbox sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "messages"}
          onClick={() => setTab("messages")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            tab === "messages" ? "bg-sage text-white" : "border border-border bg-card text-foreground/75 hover:border-sage",
          )}
        >
          <Inbox className="h-4 w-4" aria-hidden="true" />
          Messages
          {unread > 0 && (
            <span className={cn(
              "rounded-full px-1.5 text-[11px] font-semibold",
              tab === "messages" ? "bg-white/20" : "bg-terracotta text-white",
            )}>
              {unread}
            </span>
          )}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "subscribers"}
          onClick={() => setTab("subscribers")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            tab === "subscribers" ? "bg-sage text-white" : "border border-border bg-card text-foreground/75 hover:border-sage",
          )}
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          Subscribers ({subscribers.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading…
        </div>
      ) : tab === "messages" ? (
        messages.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Mail className="mb-3 h-10 w-10 text-sage/40" aria-hidden="true" />
            <p className="font-medium">No messages yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Messages from the public contact form land here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className={cn("rounded-xl border bg-card transition-colors", m.read ? "border-border" : "border-sage/40")}>
                <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMessage(openMessage === m.id ? null : m.id);
                      if (!m.read) toggleRead(m);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {m.read ? <MailOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" /> : <Mail className="h-3.5 w-3.5 shrink-0 text-sage" aria-hidden="true" />}
                      <span className="truncate">{m.subject}</span>
                      {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-sage" aria-label="Unread" />}
                    </p>
                    <p className="mt-0.5 pl-6 text-xs text-muted-foreground">
                      {m.name} · {m.email} · {formatDateTime(m.createdAt)}
                    </p>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleRead(m)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Mark as {m.read ? "unread" : "read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMessage(m)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive/70 hover:bg-terracotta-soft hover:text-destructive"
                      aria-label={`Delete message from ${m.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {openMessage === m.id && (
                  <div className="border-t border-border bg-muted/40 px-6 py-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/85">{m.message}</p>
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                      className="btn-sage mt-4 px-4 py-2 text-xs"
                    >
                      Reply by email
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )
      ) : subscribers.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-sage/40" aria-hidden="true" />
          <p className="font-medium">No subscribers yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Newsletter signups from the homepage will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                <th scope="col" className="px-4 py-3 font-semibold">Subscribed</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateTime(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeSubscriber(s)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive/80 hover:bg-terracotta-soft hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
