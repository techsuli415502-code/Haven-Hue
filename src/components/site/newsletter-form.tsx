"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

/**
 * Newsletter signup — stores the subscriber in the database via /api/newsletter.
 * The success message is honest: the email is saved for the site owner (visible
 * in the admin inbox); no email delivery is claimed unless an email service is configured.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState("success");
        setMessage(data.message ?? "You're on the list!");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  };

  if (state === "success") {
    return (
      <p className="flex items-center gap-2 rounded-full bg-sage-soft px-5 py-3 text-sm font-medium text-sage-deep">
        <Mail className="h-4 w-4" aria-hidden="true" />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          autoComplete="email"
          className="h-12 w-full rounded-full border border-input bg-card px-5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/30"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-sage h-12 shrink-0 px-6"
          aria-label="Subscribe to the newsletter"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Subscribe"}
        </button>
      </div>
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {state === "error" && (
        <p role="alert" className="mt-2 pl-2 text-sm text-destructive">
          {message}
        </p>
      )}
    </form>
  );
}
