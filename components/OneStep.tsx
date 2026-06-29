"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const competitorSteps = [
  "Business Registration",
  "GST Verification",
  "Bank Details",
  "Catalog Upload",
  "Logistics Setup",
  "Payment Gateway",
  "Go Live",
];

const successChecks = [
  "ONDC registered",
  "Logistics paired",
  "Payments active",
  "Store LIVE",
];

export default function OneStep() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20% 0px" });
  const [progress, setProgress] = useState(0);
  const [checks, setChecks] = useState<number>(0);

  useEffect(() => {
    if (!inView) {
      setProgress(0);
      setChecks(0);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.min(100, (elapsed / 2500) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  useEffect(() => {
    if (progress < 100) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setChecks(i);
      if (i >= successChecks.length) clearInterval(iv);
    }, 200);
    return () => clearInterval(iv);
  }, [progress]);

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-[96px] lg:py-[128px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-bg-card border border-border text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-4">
            How it works
          </div>
          <h2 className="font-display font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-tight tracking-tight">
            Seven steps. Or just{" "}
            <span className="text-accent">one</span>.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-[600px] mx-auto">
            Competitors hand you a 45-minute checklist. We hand you a dropzone.
          </p>
        </div>

        {/* Competitor strip */}
        <div className="mb-12 lg:mb-16">
          <div className="text-[11px] uppercase tracking-[0.15em] font-semibold text-fg-muted mb-4 text-center">
            The Shopify way
          </div>
          <div className="relative">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 opacity-50">
              {competitorSteps.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-md bg-bg-card border border-border text-[12px] text-fg-muted line-through decoration-danger/60">
                    Step {i + 1}: {s}
                  </div>
                  {i < competitorSteps.length - 1 && (
                    <span className="text-fg-muted/40 text-sm">→</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 text-center text-[13px] text-danger font-medium">
              <span aria-hidden>✗</span> 7 steps · 45 minutes avg
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-border" />
          <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-fg-muted">
            The OneStep way
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Mega input zone */}
        <div className="relative max-w-[720px] mx-auto">
          <div
            className="relative rounded-[24px] p-8 lg:p-10 border-2 border-dashed transition-all"
            style={{
              borderColor:
                progress >= 100 ? "var(--secondary)" : "var(--border-active)",
              background:
                progress >= 100
                  ? "linear-gradient(180deg, rgba(0,214,143,0.04), rgba(0,214,143,0.01))"
                  : "linear-gradient(180deg, rgba(255,107,53,0.04), rgba(255,107,53,0.01))",
              boxShadow:
                progress >= 100
                  ? "0 0 60px rgba(0,214,143,0.15)"
                  : "0 0 60px rgba(255,107,53,0.10)",
            }}
          >
            <div className="text-center">
              <motion.div
                animate={
                  progress >= 100
                    ? { scale: [1, 1.1, 1], rotate: [0, 0, 0] }
                    : { y: [0, -4, 0] }
                }
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background:
                    progress >= 100
                      ? "rgba(0,214,143,0.15)"
                      : "rgba(255,107,53,0.12)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={progress >= 100 ? "text-secondary" : "text-accent"}
                >
                  {progress >= 100 ? (
                    <path
                      d="M5 12.5l5 5L20 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <>
                      <path
                        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </motion.div>

              <div className="font-display font-semibold text-[24px] lg:text-[28px]">
                Drop your catalog here
              </div>
              <div className="text-fg-muted text-[14px] mt-1">
                CSV, Excel, or photos of your products
              </div>

              {/* Progress bar */}
              <div className="mt-7 max-w-[460px] mx-auto">
                <div className="h-2 rounded-full bg-bg-card overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background:
                        progress >= 100
                          ? "linear-gradient(90deg, var(--secondary), #4ee5b1)"
                          : "linear-gradient(90deg, var(--accent), #ff9466)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                      backgroundSize: "200% 100%",
                      animation:
                        progress < 100 ? "shimmer 1.4s linear infinite" : undefined,
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[12px] font-mono text-fg-muted">
                  <span>{progress >= 100 ? "Complete" : "Setting up..."}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Checkmarks grid */}
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 max-w-[420px] mx-auto">
                {successChecks.map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={
                      i < checks
                        ? { opacity: 1, scale: [0.7, 1.2, 1] }
                        : { opacity: 0.25, scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 text-[14px]"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        i < checks ? "bg-secondary" : "bg-bg-card"
                      }`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={i < checks ? "text-bg" : "text-fg-muted"}
                      >
                        <path
                          d="M5 12.5l5 5L20 7"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className={
                        i < checks ? "text-fg font-medium" : "text-fg-muted"
                      }
                    >
                      {c}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center text-[13px] font-semibold text-secondary">
            <span aria-hidden>✓</span> 1 step · 58 seconds avg
          </div>
        </div>
      </div>
    </section>
  );
}
