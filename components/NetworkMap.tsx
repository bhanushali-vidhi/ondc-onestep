"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Node = {
  id: string;
  label: string;
  ring: 1 | 2 | 3;
  angle: number;
  color: string;
  icon: string;
  detail: { type: string; stats: { label: string; value: string }[] };
};

const RING_RADII = { 1: 180, 2: 280, 3: 380 };

const nodes: Node[] = [
  // Ring 1 — Buyer apps
  {
    id: "paytm",
    label: "Paytm",
    ring: 1,
    angle: -90,
    color: "var(--accent)",
    icon: "P",
    detail: {
      type: "Buyer App",
      stats: [
        { label: "Monthly Users", value: "350M" },
        { label: "Avg Orders/day", value: "127" },
        { label: "Latency", value: "<200ms" },
      ],
    },
  },
  {
    id: "phonepe",
    label: "PhonePe",
    ring: 1,
    angle: -30,
    color: "var(--accent)",
    icon: "P",
    detail: {
      type: "Buyer App",
      stats: [
        { label: "Monthly Users", value: "500M" },
        { label: "Avg Orders/day", value: "94" },
        { label: "Latency", value: "<180ms" },
      ],
    },
  },
  {
    id: "magicpin",
    label: "Magicpin",
    ring: 1,
    angle: 30,
    color: "var(--accent)",
    icon: "M",
    detail: {
      type: "Buyer App",
      stats: [
        { label: "Active Users", value: "12M" },
        { label: "Avg Orders/day", value: "41" },
        { label: "Local reach", value: "Hyperlocal" },
      ],
    },
  },
  {
    id: "snapdeal",
    label: "Snapdeal",
    ring: 1,
    angle: 90,
    color: "var(--accent)",
    icon: "S",
    detail: {
      type: "Buyer App",
      stats: [
        { label: "Monthly Users", value: "60M" },
        { label: "Avg Orders/day", value: "38" },
        { label: "Categories", value: "All" },
      ],
    },
  },
  {
    id: "meesho",
    label: "Meesho",
    ring: 1,
    angle: 150,
    color: "var(--accent)",
    icon: "M",
    detail: {
      type: "Buyer App",
      stats: [
        { label: "Tier 2/3 reach", value: "Strong" },
        { label: "Avg Orders/day", value: "62" },
        { label: "Latency", value: "<210ms" },
      ],
    },
  },
  {
    id: "mystore",
    label: "MyStore",
    ring: 1,
    angle: 210,
    color: "var(--accent)",
    icon: "M",
    detail: {
      type: "Buyer App",
      stats: [
        { label: "ONDC native", value: "Yes" },
        { label: "Avg Orders/day", value: "29" },
        { label: "Latency", value: "<195ms" },
      ],
    },
  },

  // Ring 2 — Logistics
  {
    id: "delhivery",
    label: "Delhivery",
    ring: 2,
    angle: -60,
    color: "var(--secondary)",
    icon: "🚚",
    detail: {
      type: "Logistics",
      stats: [
        { label: "Pincode reach", value: "18,800+" },
        { label: "Avg pickup", value: "4h" },
        { label: "SLA", value: "99.2%" },
      ],
    },
  },
  {
    id: "dunzo",
    label: "Dunzo",
    ring: 2,
    angle: 60,
    color: "var(--secondary)",
    icon: "🛵",
    detail: {
      type: "Logistics",
      stats: [
        { label: "Cities", value: "8 metros" },
        { label: "Avg delivery", value: "45m" },
        { label: "Best for", value: "Hyperlocal" },
      ],
    },
  },
  {
    id: "shiprocket",
    label: "Shiprocket",
    ring: 2,
    angle: 180,
    color: "var(--secondary)",
    icon: "📦",
    detail: {
      type: "Logistics",
      stats: [
        { label: "Couriers", value: "17+" },
        { label: "Cheapest auto-pick", value: "Yes" },
        { label: "Pan-India", value: "Yes" },
      ],
    },
  },

  // Ring 3 — Payment rails
  {
    id: "upi",
    label: "UPI",
    ring: 3,
    angle: -120,
    color: "var(--tertiary)",
    icon: "⚡",
    detail: {
      type: "Payment Rail",
      stats: [
        { label: "Success rate", value: "98.4%" },
        { label: "Settlement", value: "T+1" },
        { label: "MDR", value: "0%" },
      ],
    },
  },
  {
    id: "cards",
    label: "Cards",
    ring: 3,
    angle: 0,
    color: "var(--tertiary)",
    icon: "💳",
    detail: {
      type: "Payment Rail",
      stats: [
        { label: "Visa / MC / Rupay", value: "All" },
        { label: "3DS", value: "Enforced" },
        { label: "Settlement", value: "T+2" },
      ],
    },
  },
  {
    id: "netbanking",
    label: "NetBanking",
    ring: 3,
    angle: 120,
    color: "var(--tertiary)",
    icon: "🏦",
    detail: {
      type: "Payment Rail",
      stats: [
        { label: "Banks", value: "60+" },
        { label: "Avg latency", value: "1.2s" },
        { label: "Best for", value: "High value" },
      ],
    },
  },
];

function polar(ring: 1 | 2 | 3, angle: number) {
  const r = RING_RADII[ring];
  const rad = (angle * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

export default function NetworkMap() {
  const [active, setActive] = useState<Node | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section id="network" className="relative py-[96px] lg:py-[128px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-bg-card border border-border text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-4">
            Live network
          </div>
          <h2 className="font-display font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-tight tracking-tight">
            Plug into the entire <span className="text-accent">ONDC ecosystem</span>.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-[640px] mx-auto">
            Buyer apps, logistics, payment rails — every node visible in real-time. Hover to inspect, click to dive in.
          </p>
        </div>

        <div className="relative">
          {/* Graph */}
          <div className="relative aspect-[16/10] lg:aspect-[16/9] max-w-[900px] mx-auto">
            {/* Ring guides */}
            <svg
              viewBox="-450 -300 900 600"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Ring circles */}
              {[1, 2, 3].map((r) => (
                <circle
                  key={r}
                  cx="0"
                  cy="0"
                  r={RING_RADII[r as 1 | 2 | 3]}
                  fill="none"
                  stroke="rgba(250,245,239,0.05)"
                  strokeDasharray="2 6"
                  strokeWidth="1"
                />
              ))}

              {/* Connection lines */}
              {nodes.map((n) => {
                const { x, y } = polar(n.ring, n.angle);
                const isHover = hover === n.id;
                const isActive = active?.id === n.id;
                const dim = (hover && !isHover) || (active && !isActive);
                return (
                  <g key={`line-${n.id}`} opacity={dim ? 0.15 : 1}>
                    <line
                      x1="0"
                      y1="0"
                      x2={x}
                      y2={y}
                      stroke={n.color}
                      strokeOpacity={isHover || isActive ? 0.8 : 0.25}
                      strokeWidth={isHover || isActive ? 1.5 : 1}
                    />
                    {/* Data packet */}
                    <circle r="3" fill={n.color}>
                      <animateMotion
                        dur={`${2 + (parseInt(n.id, 36) % 3)}s`}
                        repeatCount="indefinite"
                        path={`M0,0 L${x},${y}`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        dur={`${2 + (parseInt(n.id, 36) % 3)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Center node — user's store */}
              <g>
                <circle r="34" cx="0" cy="0" fill="var(--accent)" opacity="0.15">
                  <animate
                    attributeName="r"
                    values="34;52;34"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.25;0;0.25"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="28" cx="0" cy="0" fill="var(--accent)" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontFamily="var(--font-space)"
                  fontWeight="700"
                  fontSize="11"
                  fill="var(--fg)"
                  letterSpacing="0.05em"
                >
                  YOU
                </text>
              </g>
            </svg>

            {/* Nodes (HTML for hover/click) */}
            {nodes.map((n) => {
              const { x, y } = polar(n.ring, n.angle);
              const isHover = hover === n.id;
              const isActive = active?.id === n.id;
              const dim = (hover && !isHover) || (active && !isActive);
              return (
                <button
                  key={n.id}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setActive(n)}
                  aria-label={`${n.label} — ${n.detail.type}, connected`}
                  className="absolute top-1/2 left-1/2 group transition-all"
                  style={{
                    transform: `translate(calc(-50% + ${(x / 900) * 100}%), calc(-50% + ${(y / 600) * 100}%))`,
                    opacity: dim ? 0.35 : 1,
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center transition-all"
                    style={{
                      width: n.ring === 1 ? 56 : n.ring === 2 ? 48 : 42,
                      height: n.ring === 1 ? 56 : n.ring === 2 ? 48 : 42,
                      background: "var(--bg-elevated)",
                      border: `1.5px solid ${isHover || isActive ? n.color : "var(--border)"}`,
                      boxShadow:
                        isHover || isActive
                          ? `0 0 24px ${n.color}55, 0 0 0 1px ${n.color}`
                          : "0 4px 12px rgba(0,0,0,0.3)",
                      transform: isHover ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <span className="text-[16px]">{n.icon}</span>
                  </div>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-1.5 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
                    style={{ color: isHover || isActive ? n.color : "var(--fg-muted)" }}
                  >
                    {n.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px]">
            <Legend color="var(--accent)" label="Buyer Apps" count={6} />
            <Legend color="var(--secondary)" label="Logistics" count={3} />
            <Legend color="var(--tertiary)" label="Payment Rails" count={3} />
          </div>
        </div>
      </div>

      {/* Detail side panel */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-bg/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-bg-elevated border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted">
                      {active.detail.type}
                    </div>
                    <h3 className="font-display font-bold text-[28px] mt-1">
                      {active.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="w-9 h-9 rounded-md bg-bg-card hover:bg-border flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div
                  className="rounded-lg p-4 mb-6"
                  style={{
                    background: `${active.color}10`,
                    border: `1px solid ${active.color}30`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="pulse-dot" />
                    <span
                      className="text-[12px] font-semibold uppercase tracking-wider"
                      style={{ color: active.color }}
                    >
                      Connected
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {active.detail.stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <span className="text-[13px] text-fg-muted">{s.label}</span>
                      <span className="font-display font-semibold text-[15px]">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="btn-ghost w-full mt-8 justify-center">
                  View integration docs
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function Legend({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 text-fg-muted">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="font-medium">{label}</span>
      <span className="text-fg-muted/60">·</span>
      <span className="font-mono">{count}</span>
    </div>
  );
}
