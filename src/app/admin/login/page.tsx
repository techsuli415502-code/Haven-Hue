"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Loader2, Lock, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        setState("idle");
        setError(data.error ?? "Sign in failed. Please try again.");
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
            <Home className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-semibold">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Protected area — authorized administrators only.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_16px_48px_rgba(46,43,38,0.08)] sm:p-8">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
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
                  Signing in…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" aria-hidden="true" />
              Login attempts are rate-limited. Sessions are stored in secure HTTP-only cookies and expire after
              7 days. Public visitors cannot create admin accounts.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-sage-deep">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
