"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Loader2, ShieldCheck, UserPlus } from "lucide-react";

/**
 * One-time first-admin setup. This page is only reachable while the database
 * contains zero admin accounts (the server layout redirects otherwise).
 */
export default function AdminSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.replace("/admin/login");
        router.refresh();
      } else {
        setState("idle");
        setError(data.error ?? "Setup failed. Please try again.");
      }
    } catch {
      setState("idle");
      setError("Network error — please try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-sage focus:ring-2 focus:ring-sage/25";

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-semibold">Create the First Administrator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This one-time setup is only available until the first admin account exists.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_16px_48px_rgba(46,43,38,0.08)] sm:p-8">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="setup-name" className="text-sm font-medium">
                Your name
              </label>
              <input
                id="setup-name"
                type="text"
                required
                minLength={2}
                value={form.name}
                onChange={update("name")}
                placeholder="Jane Doe"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="setup-email" className="text-sm font-medium">
                Admin email
              </label>
              <input
                id="setup-email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="setup-password" className="text-sm font-medium">
                Password <span className="text-xs text-muted-foreground">(min. 8 characters)</span>
              </label>
              <input
                id="setup-password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={update("password")}
                placeholder="Choose a strong password"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="setup-confirm" className="text-sm font-medium">
                Confirm password
              </label>
              <input
                id="setup-confirm"
                type="password"
                required
                minLength={8}
                value={form.confirm}
                onChange={update("confirm")}
                placeholder="Repeat the password"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-terracotta-soft px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <button type="submit" disabled={state === "loading"} className="btn-sage w-full py-3">
              {state === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                "Create administrator"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" aria-hidden="true" />
              Your password is hashed with bcrypt before storage — it is never stored or transmitted in plain
              text beyond this secure form submission. After setup, this page becomes permanently unavailable.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          <Home className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
          <a href="/" className="text-muted-foreground transition-colors hover:text-sage-deep">
            Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
