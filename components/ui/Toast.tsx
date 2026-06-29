"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState } from "react";

type Variant = "success" | "info" | "warning" | "error";
type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
};

type Ctx = {
  show: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<Ctx | null>(null);

const borderColor: Record<Variant, string> = {
  success: "var(--secondary)",
  info: "var(--accent)",
  warning: "var(--tertiary)",
  error: "var(--danger)",
};

const icon: Record<Variant, string> = {
  success: "✓",
  info: "ℹ",
  warning: "!",
  error: "✕",
};

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: Omit<Toast, "id">) => {
    const id = ++counter;
    setToasts((cur) => [...cur, { id, ...t }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              className="pointer-events-auto rounded-lg bg-bg-card border border-border p-4 pr-6 min-w-[280px] max-w-[360px] shadow-elevated"
              style={{ borderLeft: `3px solid ${borderColor[t.variant]}` }}
            >
              <div className="flex gap-3">
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold"
                  style={{
                    background: `${borderColor[t.variant]}26`,
                    color: borderColor[t.variant],
                  }}
                  aria-hidden
                >
                  {icon[t.variant]}
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium">{t.title}</div>
                  {t.description && (
                    <div className="text-[13px] text-fg-muted mt-0.5">
                      {t.description}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
