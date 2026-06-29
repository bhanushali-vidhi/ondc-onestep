"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

type Node = {
  id: string;
  label: string;
  category: "buyers" | "logistics" | "payments";
  icon: string;
  color: string;
  detail: { type: string; stats: { label: string; value: string }[] };
};

const nodes: Node[] = [
  // Buyer apps (top arc)
  {
    id: "paytm",
    label: "Paytm",
    category: "buyers",
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
    category: "buyers",
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
    category: "buyers",
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
    category: "buyers",
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
    category: "buyers",
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
    category: "buyers",
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

  // Logistics (bottom-right arc)
  {
    id: "delhivery",
    label: "Delhivery",
    category: "logistics",
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
    category: "logistics",
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
    category: "logistics",
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

  // Payment rails (bottom-left arc)
  {
    id: "upi",
    label: "UPI",
    category: "payments",
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
    category: "payments",
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
    category: "payments",
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

/**
 * Sectored radial layout — each category gets its own angular wedge so
 * labels never compete for the same arc.
 *
 * Angle convention: 0° points right, 90° points down (SVG default).
 * - Buyers:    top arc, 200° → 340° (counter-clockwise through 270° = top)
 * - Logistics: bottom-right, 20° → 80°
 * - Payments:  bottom-left, 100° → 160°
 */
const SECTORS = {
  buyers: { start: 200, end: 340, radius: 220, label: "Buyer Apps" },
  logistics: { start: 20, end: 80, radius: 240, label: "Logistics" },
  payments: { start: 100, end: 160, radius: 240, label: "Payment Rails" },
} as const;

function polar(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

function arcPath(startDeg: number, endDeg: number, r: number, sweep = 0) {
  const s = polar(startDeg, r);
  const e = polar(endDeg, r);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} ${sweep} ${e.x} ${e.y}`;
}

function sectorWedge(startDeg: number, endDeg: number, inner: number, outer: number) {
  const sOuter = polar(startDeg, outer);
  const eOuter = polar(endDeg, outer);
  const sInner = polar(startDeg, inner);
  const eInner = polar(endDeg, inner);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `
    M ${sOuter.x} ${sOuter.y}
    A ${outer} ${outer} 0 ${large} 1 ${eOuter.x} ${eOuter.y}
    L ${eInner.x} ${eInner.y}
    A ${inner} ${inner} 0 ${large} 0 ${sInner.x} ${sInner.y}
    Z
  `;
}

export default function NetworkMap() {
  const [active, setActive] = useState<Node | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  // Precompute positions for each node
  const positioned = useMemo(() => {
    const groups = ["buyers", "logistics", "payments"] as const;
    const result: (Node & { x: number; y: number; angle: number })[] = [];
    groups.forEach((cat) => {
      const sec = SECTORS[cat];
      const items = nodes.filter((n) => n.category === cat);
      const span = sec.end - sec.start;
      // Distribute evenly with margin from edges
      items.forEach((n, i) => {
        const t = items.length === 1 ? 0.5 : i / (items.length - 1);
        // Add 8% inset on each side so nodes don't kiss the wedge edges
        const angle = sec.start + (0.08 + t * 0.84) * span;
        const { x, y } = polar(angle, sec.radius);
        result.push({ ...n, x, y, angle });
      });
    });
    return result;
  }, []);

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
          <div className="relative aspect-[5/4] max-w-[920px] mx-auto">
            <svg
              viewBox="-480 -340 960 680"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="buyers-grad" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient id="logistics-grad" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0" />
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient id="payments-grad" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="var(--tertiary)" stopOpacity="0" />
                  <stop offset="100%" stopColor="var(--tertiary)" stopOpacity="0.08" />
                </radialGradient>
              </defs>

              {/* Sector wedges (very faint backdrops) */}
              {(["buyers", "logistics", "payments"] as const).map((cat) => {
                const sec = SECTORS[cat];
                return (
                  <path
                    key={cat}
                    d={sectorWedge(sec.start, sec.end, 110, sec.radius + 80)}
                    fill={`url(#${cat}-grad)`}
                  />
                );
              })}

              {/* Sector arc rails (where nodes sit) */}
              {(["buyers", "logistics", "payments"] as const).map((cat) => {
                const sec = SECTORS[cat];
                const color =
                  cat === "buyers"
                    ? "var(--accent)"
                    : cat === "logistics"
                    ? "var(--secondary)"
                    : "var(--tertiary)";
                return (
                  <path
                    key={`rail-${cat}`}
                    d={arcPath(sec.start, sec.end, sec.radius, 1)}
                    fill="none"
                    stroke={color}
                    strokeOpacity="0.15"
                    strokeWidth="1.5"
                    strokeDasharray="3 6"
                  />
                );
              })}

              {/* Sector labels (curved, follow the arc) */}
              {(["buyers", "logistics", "payments"] as const).map((cat) => {
                const sec = SECTORS[cat];
                const mid = (sec.start + sec.end) / 2;
                const labelR = sec.radius + 64;
                const { x, y } = polar(mid, labelR);
                const color =
                  cat === "buyers"
                    ? "var(--accent)"
                    : cat === "logistics"
                    ? "var(--secondary)"
                    : "var(--tertiary)";
                return (
                  <g key={`label-${cat}`}>
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      fontSize="11"
                      letterSpacing="0.2em"
                      fontFamily="var(--font-dm)"
                      fontWeight="600"
                      fill={color}
                      opacity="0.7"
                    >
                      {sec.label.toUpperCase()}
                    </text>
                    <text
                      x={x}
                      y={y + 14}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="var(--font-jetbrains)"
                      fill="var(--fg-muted)"
                    >
                      {nodes.filter((n) => n.category === cat).length} nodes
                    </text>
                  </g>
                );
              })}

              {/* Connection lines */}
              {positioned.map((n) => {
                const isHover = hover === n.id;
                const isActive = active?.id === n.id;
                const dim = (hover && !isHover) || (active && !isActive);
                return (
                  <g key={`line-${n.id}`} opacity={dim ? 0.15 : 1}>
                    <line
                      x1="0"
                      y1="0"
                      x2={n.x}
                      y2={n.y}
                      stroke={n.color}
                      strokeOpacity={isHover || isActive ? 0.85 : 0.28}
                      strokeWidth={isHover || isActive ? 1.8 : 1}
                    />
                    <circle r="3" fill={n.color}>
                      <animateMotion
                        dur={`${2.2 + (parseInt(n.id, 36) % 3) * 0.4}s`}
                        repeatCount="indefinite"
                        path={`M0,0 L${n.x},${n.y}`}
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

              {/* Center node — user's store */}
              <g>
                <circle r="40" fill="var(--accent)" opacity="0.15">
                  <animate
                    attributeName="r"
                    values="40;58;40"
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
                <circle r="48" fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="1.5" />
                <circle r="34" fill="var(--accent)" />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontFamily="var(--font-space)"
                  fontWeight="700"
                  fontSize="13"
                  fill="#faf5ef"
                  letterSpacing="0.08em"
                >
                  YOUR STORE
                </text>
              </g>
            </svg>

            {/* Nodes (HTML — easier for hover/click + crisper text) */}
            {positioned.map((n) => {
              const isHover = hover === n.id;
              const isActive = active?.id === n.id;
              const dim = (hover && !isHover) || (active && !isActive);
              const size = 60;
              // Label position offset radially outward from the node
              const labelOutset = 18;
              const norm = Math.hypot(n.x, n.y);
              const lx = n.x + (n.x / norm) * labelOutset;
              const ly = n.y + (n.y / norm) * labelOutset;

              return (
                <div
                  key={n.id}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    transform: `translate(calc(-50% + ${(n.x / 960) * 100}%), calc(-50% + ${(n.y / 680) * 100}%))`,
                    opacity: dim ? 0.35 : 1,
                    transition: "opacity 200ms",
                  }}
                >
                  <button
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setActive(n)}
                    aria-label={`${n.label} — ${n.detail.type}, connected`}
                    className="pointer-events-auto group"
                    style={{ marginLeft: -size / 2, marginTop: -size / 2 }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center transition-all"
                      style={{
                        width: size,
                        height: size,
                        background: "var(--bg-elevated)",
                        border: `1.5px solid ${isHover || isActive ? n.color : "var(--border)"}`,
                        boxShadow:
                          isHover || isActive
                            ? `0 0 24px ${n.color}55, 0 0 0 1px ${n.color}`
                            : "var(--shadow-card)",
                        transform: isHover ? "scale(1.12)" : "scale(1)",
                      }}
                    >
                      <span className="text-[18px]">{n.icon}</span>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Node labels — placed outside each node on the radial direction */}
            {positioned.map((n) => {
              const isHover = hover === n.id;
              const isActive = active?.id === n.id;
              const dim = (hover && !isHover) || (active && !isActive);
              const norm = Math.hypot(n.x, n.y);
              const offset = 44; // distance from node center
              const lx = n.x + (n.x / norm) * offset;
              const ly = n.y + (n.y / norm) * offset;
              return (
                <div
                  key={`label-${n.id}`}
                  className="absolute top-1/2 left-1/2 pointer-events-none whitespace-nowrap"
                  style={{
                    transform: `translate(calc(-50% + ${(lx / 960) * 100}%), calc(-50% + ${(ly / 680) * 100}%))`,
                    opacity: dim ? 0.3 : 1,
                    transition: "opacity 200ms",
                  }}
                >
                  <div
                    className="text-[11px] font-mono uppercase tracking-wider text-center"
                    style={{
                      color: isHover || isActive ? n.color : "var(--fg-muted)",
                      transition: "color 200ms",
                    }}
                  >
                    {n.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px]">
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
