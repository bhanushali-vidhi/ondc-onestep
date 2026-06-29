"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function Drawer({
  open,
  onClose,
  children,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg/60 backdrop-blur-sm z-[70]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            style={{ width: `min(${width}px, 100vw)` }}
            className="fixed top-0 right-0 bottom-0 bg-bg-elevated border-l border-border z-[71] overflow-y-auto"
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
