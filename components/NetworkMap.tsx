"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

type Category = "buyers" | "logistics" | "payments";

type Node = {
  id: string;
  label: string;
  category: Category;
  icon: string;
  color: string;
  detail: { type: string; stats: { label: string; value: string }[] };
};

const nodes: Node[] = [
  // Buyer apps — left column
  { id: "paytm", label: "Paytm", category: "buyers", color: "var(--accent)", icon: "P",
    detail: { type: "Buyer App", stats: [
      { label: "Monthly Users", value: "350M" },
      { label: "Avg Orders/day", value: "127" },
      { label: "Latency", value: "<200ms" },
    ]}},
  { id: "phonepe", label: "PhonePe", category: "buyers", color: "var(--accent)", icon: "P",
    detail: { type: "Buyer App", stats: [
      { label: "Monthly Users", value: "500M" },
      { label: "Avg Orders/day", value: "94" },
      { label: "Latency", value: "<180ms" },
    ]}},
  { id: "magicpin", label: "Magicpin", category: "buyers", color: "var(--accent)", icon: "M",
    detail: { type: "Buyer App", stats: [
      { label: "Active Users", value: "12M" },
      { label: "Avg Orders/day", value: "41" },
      { label: "Local reach", value: "Hyperlocal" },
    ]}},
  { id: "snapdeal", label: "Snapdeal", category: "buyers", color: "var(--accent)", icon: "S",
    detail: { type: "Buyer App", stats: [
      { label: "Monthly Users", value: "60M" },
      { label: "Avg Orders/day", value: "38" },
      { label: "Categories", value: "All" },
    ]}},
  { id: "meesho", label: "Meesho", category: "buyers", color: "var(--accent)", icon: "M",
    detail: { type: "Buyer App", stats: [
      { label: "Tier 2/3 reach", value: "Strong" },
      { label: "Avg Orders/day", value: "62" },
      { label: "Latency", value: "<210ms" },
    ]}},
  { id: "mystore", label: "MyStore", category: "buyers", color: "var(--accent)", icon: "M",
    detail: { type: "Buyer App", stats: [
      { label: "ONDC native", value: "Yes" },
      { label: "Avg Orders/day", value: "29" },
      { label: "Latency", value: "<195ms" },
    ]}},

  // Logistics — right column
  { id: "delhivery", label: "Delhivery", category: "logistics", color: "var(--secondary)", icon: "🚚",
    detail: { type: "Logistics", stats: [
      { label: "Pincode reach", value: "18,800+" },
      { label: "Avg pickup", value: "4h" },
      { label: "SLA", value: "99.2%" },
    ]}},
  { id: "dunzo", label: "Dunzo", category: "logistics", color: "var(--secondary)", icon: "🛵",
    detail: { type: "Logistics", stats: [
      { label: "Cities", value: "8 metros" },
      { label: "Avg delivery", value: "45m" },
      { label: "Best for", value: "Hyperlocal" },
    ]}},
  { id: "shiprocket", label: "Shiprocket", category: "logistics", color: "var(--secondary)", icon: "📦",
    detail: { type: "Logistics", stats: [
      { label: "Couriers", value: "17+" },
      { label: "Cheapest auto-pick", value: "Yes" },
      { label: "Pan-India", value: "Yes" },
    ]}},

  // Payment rails — bottom row
  { id: "upi", label: "UPI", category: "payments", color: "var(--tertiary)", icon: "⚡",
    detail: { type: "Payment Rail", stats: [
      { label: "Success rate", value: "98.4%" },
      { label: "Settlement", value: "T+1" },
      { label: "MDR", value: "0%" },
    ]}},
  { id: "cards", label: "Cards", category: "payments", color: "var(--tertiary)", icon: "💳",
    detail: { type: "Payment Rail", stats: [
      { label: "Visa / MC / Rupay", value: "All" },
      { label: "3DS", value: "Enforced" },
      { label: "Settlement", value: "T+2" },
    ]}},
  { id: "netbanking", label: "NetBanking", category: "payments", color: "var(--tertiary)", icon: "🏦",
    detail: { type: "Payment Rail", stats: [
      { label: "Banks", value: "60+" },
      { label: "Avg latency", value: "1.2s" },
      { label: "Best for", value: "High value" },
    ]}},
];

const VB = { w: 1000, h: 620 };
const CENTER = { x: VB.w / 2, y: 250 }; // store hub
const HUB_R = 64;
const NODE_R = 28; // node circle radius
const NODE_BOX = 64; // hit box

const COL_X = { buyers: 110, logistics: VB.w - 110 } as const;
const PAY_Y = 540;

function nodePositions() {
  const out: (Node & { x: number; y: number })[] = [];

  const buyers = nodes.filter((n) => n.category === "buyers");
  const logistics = nodes.filter((n) => n.category === "logistics");
  const payments = nodes.filter((n) => n.category === "payments");

  // Buyers — vertical column, evenly spaced
  buyers.forEach((n, i) => {
    const top = 60;
    const bottom = 440;
    const span = bottom - top;
    const y = top + (buyers.length === 1 ? span / 2 : (i / (buyers.length - 1)) * span);
    out.push({ ...n, x: COL_X.buyers, y });
  });

  // Logistics — vertical column on right
  logistics.forEach((n, i) => {
    const top = 130;
    const bottom = 370;
    const span = bottom - top;
    const y = top + (logistics.length === 1 ? span / 2 : (i / (logistics.length - 1)) * span);
    out.push({ ...n, x: COL_X.logistics, y });
  });

  // Payments — horizontal row at bottom, centered
  const payCount = payments.length;
  const paySpan = 480;
  const payStart = (VB.w - paySpan) / 2;
  payments.forEach((n, i) => {
    const x = payStart + (payCount === 1 ? paySpan / 2 : (i / (payCount - 1)) * paySpan);
    out.push({ ...n, x, y: PAY_Y });
  });

  return out;
}

export default function NetworkMap() {
  const [active, setActive] = useState<Node | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const positioned = useMemo(nodePositions, []);

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
            Buyer apps send you orders. Logistics partners deliver them. Payments settle automatically.
          </p>
        </div>

        <div className="relative">
          <div
            className="relative mx-auto"
            style={{ maxWidth: VB.w, aspectRatio: `${VB.w} / ${VB.h}` }}
          >
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="zone-buyers" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="zone-logistics" x1="1" x2="0">
                  <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="zone-payments" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="var(--tertiary)" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="var(--tertiary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Soft zone backgrounds (with rounded corners) */}
              <rect x="40" y="30" width="170" height="460" rx="24" fill="url(#zone-buyers)" />
              <rect x={VB.w - 210} y="30" width="170" height="460" rx="24" fill="url(#zone-logistics)" />
              <rect x="260" y="500" width="480" height="100" rx="24" fill="url(#zone-payments)" />

              {/* Zone headers */}
              <ZoneHeader x={110} y={20} label="BUYER APPS" count={6} color="var(--accent)" />
              <ZoneHeader x={VB.w - 110} y={20} label="LOGISTICS" count={3} color="var(--secondary)" />
              <ZoneHeader x={VB.w / 2} y={490} label="PAYMENTS" count={3} color="var(--tertiary)" sub />

              {/* Connection lines */}
              {positioned.map((n) => {
                const isHover = hover === n.id;
                const isActive = active?.id === n.id;
                const dim = (hover && !isHover) || (active && !isActive);

                // Curved bezier from node to hub edge
                const dx = CENTER.x - n.x;
                const dy = CENTER.y - n.y;
                const len = Math.hypot(dx, dy);
                // Trim line so it stops at the edge of node and hub
                const t1 = NODE_R / len;
                const t2 = (len - HUB_R) / len;
                const start = { x: n.x + dx * t1, y: n.y + dy * t1 };
                const end = { x: n.x + dx * t2, y: n.y + dy * t2 };

                // Curve control point for natural arc
                let cx: number, cy: number;
                if (n.category === "payments") {
                  // Curve downward into the center
                  cx = (start.x + end.x) / 2;
                  cy = start.y;
                } else {
                  // Horizontal curve
                  cx = (start.x + end.x) / 2;
                  cy = (start.y + end.y) / 2;
                }
                const path = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;

                return (
                  <g key={`line-${n.id}`} opacity={dim ? 0.15 : 1}>
                    <path
                      d={path}
                      fill="none"
                      stroke={n.color}
                      strokeOpacity={isHover || isActive ? 0.9 : 0.25}
                      strokeWidth={isHover || isActive ? 2 : 1.2}
                      strokeLinecap="round"
                    />
                    <circle r="3" fill={n.color}>
                      <animateMotion
                        dur={`${2.2 + (parseInt(n.id, 36) % 3) * 0.4}s`}
                        repeatCount="indefinite"
                        path={path}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        dur={`${2.2 + (parseInt(n.id, 36) % 3) * 0.4}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Center hub — store */}
              <g>
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={HUB_R - 8}
                  fill="var(--accent)"
                  opacity="0.15"
                >
                  <animate
                    attributeName="r"
                    values={`${HUB_R - 8};${HUB_R + 12};${HUB_R - 8}`}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.28;0;0.28"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={HUB_R}
                  fill="var(--bg-elevated)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={HUB_R - 14}
                  fill="var(--accent)"
                />
                <text
                  x={CENTER.x}
                  y={CENTER.y - 4}
                  textAnchor="middle"
                  fontFamily="var(--font-space)"
                  fontWeight="700"
                  fontSize="13"
                  fill="#faf5ef"
                  letterSpacing="0.08em"
                >
                  YOUR
                </text>
                <text
                  x={CENTER.x}
                  y={CENTER.y + 12}
                  textAnchor="middle"
                  fontFamily="var(--font-space)"
                  fontWeight="700"
                  fontSize="13"
                  fill="#faf5ef"
                  letterSpacing="0.08em"
                >
                  STORE
                </text>
              </g>

              {/* Nodes */}
              {positioned.map((n) => {
                const isHover = hover === n.id;
                const isActive = active?.id === n.id;
                const dim = (hover && !isHover) || (active && !isActive);

                // Label position: left of buyers, right of logistics, below payments
                const labelPos =
                  n.category === "buyers"
                    ? { x: n.x - NODE_R - 8, y: n.y + 4, anchor: "end" as const }
                    : n.category === "logistics"
                    ? { x: n.x + NODE_R + 8, y: n.y + 4, anchor: "start" as const }
                    : { x: n.x, y: n.y + NODE_R + 18, anchor: "middle" as const };

                return (
                  <g key={n.id} opacity={dim ? 0.35 : 1} style={{ transition: "opacity 200ms" }}>
                    {/* Hit box (transparent, larger than node for easier hover) */}
                    <rect
                      x={n.x - NODE_BOX / 2}
                      y={n.y - NODE_BOX / 2}
                      width={NODE_BOX}
                      height={NODE_BOX}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHover(n.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setActive(n)}
                      role="button"
                      aria-label={`${n.label} — ${n.detail.type}, connected`}
                    />
                    {/* Glow on hover */}
                    {(isHover || isActive) && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={NODE_R + 10}
                        fill={n.color}
                        opacity="0.12"
                      />
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={NODE_R}
                      fill="var(--bg-elevated)"
                      stroke={isHover || isActive ? n.color : "var(--border)"}
                      strokeWidth={isHover || isActive ? 2 : 1.5}
                      style={{ transition: "stroke 200ms" }}
                    />
                    <text
                      x={n.x}
                      y={n.y + 6}
                      textAnchor="middle"
                      fontSize="18"
                      style={{ pointerEvents: "none" }}
                    >
                      {n.icon}
                    </text>
                    {/* Label */}
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor={labelPos.anchor}
                      fontSize="12"
                      fontFamily="var(--font-dm)"
                      fontWeight="500"
                      fill={isHover || isActive ? n.color : "var(--fg)"}
                      style={{ pointerEvents: "none", transition: "fill 200ms" }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px]">
            <Legend color="var(--accent)" label="Buyer Apps" count={6} dir="→ orders in" />
            <Legend color="var(--secondary)" label="Logistics" count={3} dir="→ delivery" />
            <Legend color="var(--tertiary)" label="Payment Rails" count={3} dir="→ settled" />
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
                    background: `color-mix(in srgb, ${active.color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${active.color} 30%, transparent)`,
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

function ZoneHeader({
  x,
  y,
  label,
  count,
  color,
  sub,
}: {
  x: number;
  y: number;
  label: string;
  count: number;
  color: string;
  sub?: boolean;
}) {
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize="11"
        letterSpacing="0.2em"
        fontFamily="var(--font-dm)"
        fontWeight="600"
        fill={color}
        opacity="0.8"
      >
        {label}
      </text>
      <text
        x={x}
        y={y + (sub ? -14 : 14)}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--font-jetbrains)"
        fill="var(--fg-muted)"
      >
        {count} connected
      </text>
    </g>
  );
}

function Legend({
  color,
  label,
  count,
  dir,
}: {
  color: string;
  label: string;
  count: number;
  dir: string;
}) {
  return (
    <div className="flex items-center gap-2 text-fg-muted">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="font-medium" style={{ color }}>{label}</span>
      <span className="text-fg-muted/60">·</span>
      <span className="font-mono">{count}</span>
      <span className="text-fg-muted/60 hidden sm:inline">·</span>
      <span className="hidden sm:inline text-[11px]">{dir}</span>
    </div>
  );
}
