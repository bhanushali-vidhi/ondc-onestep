"use client";

import { motion } from "framer-motion";
import StoreCardAnimated from "./StoreCardAnimated";

const headline = "Your Store, Live on ONDC.\nIn One Step.";

export default function Hero() {
  const words = headline.split(/(\s+|\n)/);

  return (
    <section className="relative pt-[120px] pb-[96px] lg:pt-[160px] lg:pb-[128px] overflow-hidden">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-[100px] right-[-200px] w-[500px] h-[500px] rounded-full bg-secondary/[0.06] blur-[120px]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary/15 border border-tertiary/30 mb-6"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span className="text-[12px] font-semibold tracking-wider uppercase text-tertiary">
              Now ONDC Certified
            </span>
          </motion.div>

          <h1 className="font-display font-bold text-[44px] sm:text-[56px] lg:text-[72px] xl:text-[80px] leading-[1.04] tracking-tight whitespace-pre-line">
            {words.map((w, i) =>
              w === "\n" ? (
                <br key={i} />
              ) : (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="inline-block"
                >
                  {w === " " ? " " : w}
                </motion.span>
              )
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-[18px] lg:text-[20px] leading-[1.55] text-fg-muted max-w-[560px]"
          >
            Upload your catalog. We handle ONDC registration, logistics,
            payments, and discovery. No config hell, no 47-step wizards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a href="/login" className="btn-primary">
              Build Your Store <span aria-hidden>→</span>
            </a>
            <a href="#demo" className="btn-ghost">
              <span aria-hidden>▶</span> Watch 60s Demo
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-fg-muted"
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-fg text-[16px]">2,400+</span>
              <span>stores live</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-fg text-[16px]">₹12Cr</span>
              <span>GMV processed</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-fg text-[16px]">{"<60s"}</span>
              <span>avg setup</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Animated store card */}
        <div className="relative">
          <StoreCardAnimated />
        </div>
      </div>
    </section>
  );
}
