"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Network Map", href: "#network" },
  { label: "Skill Hub", href: "#skill" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled
          ? "backdrop-blur-xl bg-bg/80 border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <a href="/" className="font-display font-bold text-[20px] tracking-tight">
          <span className="text-accent">ONDC</span>
          <span className="text-fg"> OneStep</span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative px-4 py-2 text-[14px] font-medium text-fg-muted hover:text-fg transition-colors duration-200 group"
            >
              {l.label}
              <span className="absolute left-4 right-4 bottom-1 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/login"
            className="text-[14px] font-medium text-fg-muted hover:text-fg transition-colors px-4 py-2"
          >
            Login
          </a>
          <a href="/login" className="btn-primary !py-2.5 !px-5 text-[14px]">
            Build Store <span aria-hidden>→</span>
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className={`block w-5 h-[2px] bg-fg transition-transform ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-fg transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-fg transition-transform ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 top-[72px] bg-bg/95 backdrop-blur-xl z-40"
          >
            <div className="px-6 py-8 flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="text-[24px] font-display font-semibold py-3 border-b border-border"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * links.length }}
                className="flex flex-col gap-3 pt-6"
              >
                <a href="/login" className="btn-ghost w-full justify-center">
                  Login
                </a>
                <a href="/login" className="btn-primary w-full justify-center">
                  Build Store →
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
