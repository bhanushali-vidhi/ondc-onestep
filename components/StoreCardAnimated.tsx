"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Stage = 0 | 1 | 2 | 3;
// 0 wireframe → 1 fills color → 2 ONDC badge → 3 live (pulse)

const metrics = [
  { label: "Catalog", value: "24 items" },
  { label: "Logistics", value: "3 partners" },
  { label: "Payments", value: "UPI + Cards" },
];

export default function StoreCardAnimated() {
  const [stage, setStage] = useState<Stage>(0);
  const [metricIdx, setMetricIdx] = useState(0);

  useEffect(() => {
    const loop = () => {
      setStage(0);
      setTimeout(() => setStage(1), 1200);
      setTimeout(() => setStage(2), 2800);
      setTimeout(() => setStage(3), 4200);
    };
    loop();
    const iv = setInterval(loop, 6000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(
      () => setMetricIdx((i) => (i + 1) % metrics.length),
      2200
    );
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative mx-auto max-w-[440px]" aria-hidden="true">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Card */}
        <div
          className={`relative rounded-[24px] overflow-hidden border transition-all duration-700 ${
            stage >= 1
              ? "bg-bg-elevated border-border-active"
              : "bg-bg-card border-border"
          }`}
          style={{
            boxShadow:
              stage >= 3
                ? "0 20px 60px rgba(0,214,143,0.15), 0 0 0 1px rgba(0,214,143,0.2)"
                : stage >= 1
                ? "var(--shadow-elevated)"
                : "var(--shadow-card)",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg transition-colors duration-500 ${
                  stage >= 1 ? "bg-accent" : "bg-bg-card border border-border"
                }`}
              />
              <div className="space-y-1">
                <div
                  className={`h-2.5 w-24 rounded-sm transition-colors duration-500 ${
                    stage >= 1 ? "bg-fg/90" : "bg-fg-muted/20"
                  }`}
                />
                <div
                  className={`h-1.5 w-16 rounded-sm transition-colors duration-500 ${
                    stage >= 1 ? "bg-fg-muted/60" : "bg-fg-muted/15"
                  }`}
                />
              </div>
            </div>
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/15 border border-accent/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    ONDC
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product grid */}
          <div className="p-5 grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  backgroundColor:
                    stage >= 1
                      ? i % 3 === 0
                        ? "rgba(255,107,53,0.15)"
                        : i % 3 === 1
                        ? "rgba(0,214,143,0.10)"
                        : "rgba(255,184,0,0.12)"
                      : "rgba(250,245,239,0.04)",
                  borderColor:
                    stage >= 1 ? "rgba(250,245,239,0.08)" : "rgba(250,245,239,0.06)",
                }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="aspect-square rounded-lg border"
              >
                <div className="h-full p-2 flex flex-col justify-end gap-1">
                  <div
                    className={`h-1.5 rounded-sm transition-colors duration-500 ${
                      stage >= 1 ? "bg-fg/70 w-3/4" : "bg-fg-muted/20 w-2/3"
                    }`}
                  />
                  <div
                    className={`h-1 rounded-sm transition-colors duration-500 ${
                      stage >= 1 ? "bg-fg-muted/60 w-1/2" : "bg-fg-muted/15 w-1/3"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom status */}
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              {stage >= 3 ? (
                <>
                  <span className="pulse-dot" />
                  <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                    Store Live
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-fg-muted/30" />
                  <span className="text-[12px] text-fg-muted">
                    {stage === 0
                      ? "Wireframe"
                      : stage === 1
                      ? "Building..."
                      : "Connecting..."}
                  </span>
                </>
              )}
            </div>
            <div className="text-[11px] font-mono text-fg-muted">
              {stage >= 3 ? "100%" : stage >= 2 ? "85%" : stage >= 1 ? "55%" : "10%"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating metric chip */}
      <div className="absolute -bottom-6 -left-6 lg:-left-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={metricIdx}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-2.5 rounded-xl bg-bg-elevated border border-border-active flex items-center gap-2.5"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <div className="w-7 h-7 rounded-md bg-accent/15 flex items-center justify-center">
              <span className="text-accent text-[13px]">✓</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-fg-muted font-semibold">
                {metrics[metricIdx].label}
              </div>
              <div className="text-[13px] font-display font-semibold text-fg">
                {metrics[metricIdx].value}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
