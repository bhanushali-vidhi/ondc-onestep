"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (mode === "signup") {
        // Mark this as a fresh signup so the dashboard knows to onboard
        try {
          localStorage.removeItem("ondc-onestep:store@v1");
          localStorage.setItem("ondc-onestep:fresh", "1");
        } catch {}
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    }, 700);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1fr]">
      {/* Left: Form */}
      <div className="flex flex-col px-6 sm:px-12 lg:px-16 py-8 lg:py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-bold text-[20px] tracking-tight"
          >
            <span className="text-accent">ONDC</span>
            <span className="text-fg"> OneStep</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[420px] mx-auto">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                {mode === "login" ? "Welcome back." : "Start in 60 seconds."}
              </h1>
              <p className="mt-2 text-[15px] text-fg-muted">
                {mode === "login"
                  ? "Sign in to your store dashboard."
                  : "No credit card. No setup fees."}
              </p>

              <div className="mt-8 space-y-3">
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md bg-bg-card hover:bg-bg-elevated border border-border hover:border-fg-muted/40 transition-all text-[14px] font-medium">
                  <GoogleIcon /> Continue with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md bg-bg-card hover:bg-bg-elevated border border-border hover:border-fg-muted/40 transition-all text-[14px] font-medium">
                  <span className="text-[16px]">📱</span> Continue with Phone (OTP)
                </button>
              </div>

              <div className="my-6 flex items-center gap-4 text-[12px] text-fg-muted">
                <div className="flex-1 h-px bg-border" />
                <span>or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[13px] font-medium text-fg-muted mb-1.5"
                    >
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anjali Sharma"
                      className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[15px] focus:border-accent focus:outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-fg-muted mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@store.in"
                    className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[15px] focus:border-accent focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="flex items-center justify-between text-[13px] font-medium text-fg-muted mb-1.5"
                  >
                    Password
                    {mode === "login" && (
                      <a
                        href="#"
                        className="text-accent hover:underline text-[12px]"
                      >
                        Forgot?
                      </a>
                    )}
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[15px] focus:border-accent focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-fg/30 border-t-fg animate-spin" />
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                  {!loading && <span aria-hidden>→</span>}
                </button>
              </form>

              <div className="mt-6 text-center text-[14px] text-fg-muted">
                {mode === "login" ? (
                  <>
                    New to ONDC OneStep?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-accent hover:underline font-medium"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="text-accent hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="text-[12px] text-fg-muted text-center">
          By continuing you agree to our{" "}
          <a href="#" className="hover:text-fg underline underline-offset-2">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="hover:text-fg underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:block relative bg-bg-elevated border-l border-border overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/5" />

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-[440px]">
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-semibold text-accent mb-4">
              <span className="pulse-dot !w-1.5 !h-1.5 !bg-accent" />
              <span>2,400 stores live on ONDC</span>
            </div>
            <h2 className="font-display font-semibold text-[36px] leading-[1.1] tracking-tight">
              Your store, plugged into India&apos;s biggest commerce network.
            </h2>
            <p className="mt-4 text-[15px] text-fg-muted leading-relaxed">
              Once you sign in, your dashboard shows live orders flowing in from
              Paytm, PhonePe, Magicpin and more — all in one inbox.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: "Avg setup", value: "58s" },
                { label: "GMV processed", value: "₹12Cr" },
                { label: "Uptime", value: "99.8%" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-4 rounded-lg bg-bg/50 border border-border"
                >
                  <div className="font-display font-bold text-[22px] tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-fg-muted mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 rounded-xl bg-bg-card border border-border">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-accent shrink-0 flex items-center justify-center font-display font-bold text-[13px]">
                  R
                </div>
                <div>
                  <p className="text-[14px] leading-relaxed">
                    &ldquo;Listed my saree business on ONDC in under a minute.
                    Got my first order from PhonePe within 2 hours.&rdquo;
                  </p>
                  <div className="mt-2 text-[12px] text-fg-muted">
                    Rohini · Founder, Threadcraft
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
