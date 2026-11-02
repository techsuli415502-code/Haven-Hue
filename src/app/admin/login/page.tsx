"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Loader2, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { LogoMark } from "@/components/site/logo-mark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [setupNeeded, setSetupNeeded] = useState(false);

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
        setSetupNeeded(Boolean(data.setupRequired));
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
          <LogoMark className="mb-3 h-14 w-14 drop-shadow-[0_6px_16px_rgba(78,92,68,0.35)]" />
          <p className="font-display text-base font-semibold tracking-wide text-sage-deep">Haven &amp; Hue</p>
          <h1 className="mt-0.5 font-display text-2xl font-semibold">Admin Sign In</h1>
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

            {setupNeeded && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold text-amber-900">
                  <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                  One-time setup required
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] leading-5 text-amber-900/90">
                  <li>
                    Open{" "}
                    <a
                      href="https://vercel.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-2"
                    >
                      vercel.com/dashboard
                    </a>{" "}
                    and open your Haven-Hue project.
                  </li>
                  <li>Go to Settings → Environment Variables.</li>
                  <li>Add ADMIN_EMAIL and ADMIN_PASSWORD with values you will remember — save each one.</li>
                  <li>Deployments → Redeploy (env vars only take effect on a new deployment).</li>
                  <li>Sign in here with those exact values.</li>
                </ol>
              </div>
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
            <p className="mt-2.5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" aria-hidden="true" />
              <span>
                Forgot the password? Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">ADMIN_EMAIL</code> and{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">ADMIN_PASSWORD</code> in your hosting
                dashboard (Vercel → Settings → Environment Variables), redeploy, then sign in with those values.
              </span>
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
