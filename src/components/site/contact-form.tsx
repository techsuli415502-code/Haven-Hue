"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const SUBJECTS = ["General question", "Collaboration", "Feedback", "Something else"];

/**
 * Contact form — saves messages to the database (visible in the admin inbox).
 * The server response explains exactly what happened with the message.
 */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "", website: "" });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState("success");
        setMessage(data.message ?? "Your message has been received.");
        setForm({ name: "", email: "", subject: SUBJECTS[0], message: "", website: "" });
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25";

  if (state === "success") {
    return (
      <div className="rounded-xl border border-sage/30 bg-sage-soft/60 p-6" role="status">
        <h3 className="font-display text-lg text-sage-deep">Message received</h3>
        <p className="mt-2 text-sm leading-6 text-foreground/80">{message}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="btn-outline mt-4 px-5 py-2 text-xs"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium">
            Name <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <input id="contact-name" type="text" required value={form.name} onChange={update("name")} placeholder="Your name" autoComplete="name" className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium">
            Email <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <input id="contact-email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-subject" className="text-sm font-medium">
          Subject <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <select id="contact-subject" value={form.subject} onChange={update("subject")} className={inputClass}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="How can we help?"
          className={inputClass}
        />
      </div>

      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={update("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {state === "error" && (
        <p role="alert" className="rounded-lg bg-terracotta-soft px-4 py-3 text-sm text-destructive">
          {message}
        </p>
      )}

      <button type="submit" disabled={state === "loading"} className="btn-sage w-full sm:w-auto">
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
