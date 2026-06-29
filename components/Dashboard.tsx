"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { label: "Orders Today", value: 47, prefix: "" },
  { label: "Revenue", value: 24580, prefix: "₹" },
  { label: "ONDC Views", value: 1200, prefix: "", suffix: "" },
  { label: "Conversion", value: 3.8, prefix: "", suffix: "%" },
];

const revenueData = [4200, 5800, 4900, 6800, 7400, 8200, 9100];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const orders = [
  { product: "Saffron Rice 5kg", icon: "🍚", buyer: "Paytm", amount: 540, status: "shipped" },
  { product: "Garam Masala 200g", icon: "🌶️", buyer: "PhonePe", amount: 180, status: "delivered" },
  { product: "Premium Cardamom", icon: "🟢", buyer: "Magicpin", amount: 820, status: "pending" },
  { product: "Spice Combo Pack", icon: "🎁", buyer: "Snapdeal", amount: 1240, status: "shipped" },
  { product: "Turmeric 1kg", icon: "🟡", buyer: "Meesho", amount: 290, status: "delivered" },
];

export default function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section ref={ref} className="relative py-[96px] lg:py-[128px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-bg-card border border-border text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-4">
            Your command center
          </div>
          <h2 className="font-display font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-tight tracking-tight">
            One dashboard. Every channel.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-[600px] mx-auto">
            ONDC, your own storefront, all buyer apps — orders flow into one inbox.
          </p>
        </div>

        {/* Browser frame */}
        <div className="rounded-[20px] overflow-hidden border border-border bg-bg-elevated shadow-elevated">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-card">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-danger/70" />
              <span className="w-3 h-3 rounded-full bg-tertiary/70" />
              <span className="w-3 h-3 rounded-full bg-secondary/70" />
            </div>
            <div className="flex-1 mx-3 max-w-[400px] mx-auto px-3 py-1 rounded-md bg-bg text-[11px] font-mono text-fg-muted truncate text-center">
              app.ondc-onestep.com/dashboard
            </div>
            <div className="w-[60px]" />
          </div>

          {/* Top bar */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display font-bold">
                A
              </div>
              <div>
                <div className="font-display font-semibold text-[15px]">
                  Anjali&apos;s Spice Co.
                </div>
                <div className="flex items-center gap-3 text-[12px] text-fg-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="pulse-dot !w-1.5 !h-1.5" /> Online
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> ONDC Synced
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-md bg-bg-card hover:bg-border transition-colors flex items-center justify-center text-fg-muted">
                🔔
              </button>
              <button className="w-9 h-9 rounded-md bg-bg-card hover:bg-border transition-colors flex items-center justify-center text-fg-muted">
                ⚙
              </button>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-border">
            {metrics.map((m, i) => (
              <Metric key={m.label} m={m} index={i} animate={inView} />
            ))}
          </div>

          {/* Chart + Side widget */}
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-px bg-border">
            {/* Revenue chart */}
            <div className="bg-bg-elevated p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[14px] font-semibold">Revenue · Last 7 days</div>
                  <div className="text-[12px] text-fg-muted mt-0.5">
                    ₹46,400 total · +18% vs last week
                  </div>
                </div>
                <div className="flex gap-1">
                  {["7d", "30d", "90d"].map((p, i) => (
                    <button
                      key={p}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono ${
                        i === 0 ? "bg-accent/15 text-accent" : "text-fg-muted hover:bg-bg-card"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <RevenueChart animate={inView} />
            </div>

            {/* Performance gauge */}
            <div className="bg-bg-elevated p-6 flex flex-col items-center">
              <div className="text-[14px] font-semibold mb-1">ONDC Performance</div>
              <div className="text-[12px] text-fg-muted mb-5">
                Score updated every hour
              </div>
              <Gauge value={82} animate={inView} />
              <div className="mt-5 grid grid-cols-3 gap-3 w-full text-center">
                <MiniStat label="Latency" value="180ms" tint="var(--secondary)" />
                <MiniStat label="Uptime" value="99.8%" tint="var(--secondary)" />
                <MiniStat label="Disputes" value="0.4%" tint="var(--tertiary)" />
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-semibold">Recent Orders</div>
              <button className="text-[12px] text-accent hover:underline">View all →</button>
            </div>
            <div className="space-y-2">
              {orders.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 py-2.5 px-3 rounded-md hover:bg-bg-card transition-colors"
                >
                  <div className="w-9 h-9 rounded-md bg-bg-card border border-border flex items-center justify-center text-[16px]">
                    {o.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">{o.product}</div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-fg-muted">
                      via {o.buyer}
                    </div>
                  </div>
                  <div className="text-[14px] font-display font-semibold">
                    ₹{o.amount}
                  </div>
                  <div>
                    <span
                      className={`status-badge ${
                        o.status === "delivered"
                          ? "status-live"
                          : o.status === "shipped"
                          ? "status-pending"
                          : "status-error"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <button className="text-fg-muted hover:text-fg text-[14px]">⋯</button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  m,
  index,
  animate,
}: {
  m: typeof metrics[number];
  index: number;
  animate: boolean;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const e = Math.min(1, (t - start) / 1500);
      const eased = 1 - Math.pow(1 - e, 3);
      setVal(m.value * eased);
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    const to = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, index * 80);
    return () => {
      clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [animate, m.value, index]);

  const formatted =
    m.value >= 1000 && Number.isInteger(m.value)
      ? Math.round(val).toLocaleString("en-IN")
      : Number.isInteger(m.value)
      ? Math.round(val).toString()
      : val.toFixed(1);

  return (
    <div className="p-6 border-r border-border last:border-r-0 [&:nth-child(even)]:border-r-0 lg:[&:nth-child(even)]:border-r">
      <div className="text-[12px] uppercase tracking-wider text-fg-muted font-medium">
        {m.label}
      </div>
      <div className="mt-1.5 font-display font-bold text-[28px] lg:text-[32px] tracking-tight">
        {m.prefix}
        {formatted}
        {m.suffix ?? ""}
      </div>
    </div>
  );
}

function RevenueChart({ animate }: { animate: boolean }) {
  const w = 600;
  const h = 200;
  const padding = { x: 20, y: 20 };
  const max = Math.max(...revenueData) * 1.15;
  const stepX = (w - padding.x * 2) / (revenueData.length - 1);

  const points = revenueData.map((v, i) => ({
    x: padding.x + i * stepX,
    y: h - padding.y - (v / max) * (h - padding.y * 2),
  }));

  const linePath = points.reduce(
    (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
    ""
  );
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - padding.y} L ${points[0].x} ${h - padding.y} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="reveal">
          <rect x="0" y="0" width={animate ? w : 0} height={h}>
            {animate && (
              <animate
                attributeName="width"
                from="0"
                to={w}
                dur="1.2s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
            )}
          </rect>
        </clipPath>
      </defs>

      {/* Grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={padding.x}
          y1={padding.y + p * (h - padding.y * 2)}
          x2={w - padding.x}
          y2={padding.y + p * (h - padding.y * 2)}
          stroke="rgba(250,245,239,0.04)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}

      <g clipPath="url(#reveal)">
        <path d={areaPath} fill="url(#rev-fill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="2" />
          </g>
        ))}
      </g>

      {/* X labels */}
      {days.map((d, i) => (
        <text
          key={d}
          x={padding.x + i * stepX}
          y={h - 2}
          textAnchor="middle"
          fontSize="10"
          fill="var(--fg-muted)"
          fontFamily="var(--font-dm)"
        >
          {d}
        </text>
      ))}
    </svg>
  );
}

function Gauge({ value, animate }: { value: number; animate: boolean }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const e = Math.min(1, (t - start) / 1500);
      const eased = 1 - Math.pow(1 - e, 3);
      setN(value * eased);
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, value]);

  return (
    <div className="relative w-[140px] h-[140px]">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--bg-card)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={animate ? offset : c}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display font-bold text-[32px] tracking-tight">
          {Math.round(n)}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-fg-muted">
          / 100
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-muted">{label}</div>
      <div className="text-[13px] font-display font-semibold" style={{ color: tint }}>
        {value}
      </div>
    </div>
  );
}
