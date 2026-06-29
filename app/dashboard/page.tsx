"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/storeContext";
import { useToast } from "@/components/ui/Toast";
import EmptyState from "@/components/ui/EmptyState";

const baseMetrics = [
  { label: "Orders Today", key: "orders", prefix: "" as string, suffix: "" as string },
  { label: "Revenue Today", key: "revenue", prefix: "₹", suffix: "" },
  { label: "ONDC Views", key: "views", prefix: "", suffix: "" },
  { label: "Conversion", key: "conversion", prefix: "", suffix: "%" },
];

const revenueData = [4200, 5800, 4900, 6800, 7400, 8200, 9100];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const channels = [
  { name: "Paytm", orders: 18, pct: 38, color: "var(--accent)" },
  { name: "PhonePe", orders: 12, pct: 26, color: "var(--secondary)" },
  { name: "Magicpin", orders: 8, pct: 17, color: "var(--tertiary)" },
  { name: "Direct Storefront", orders: 6, pct: 13, color: "#7B61FF" },
  { name: "Other", orders: 3, pct: 6, color: "var(--fg-muted)" },
];

function greetingFor(date: Date) {
  const h = date.getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good evening";
}

export default function OverviewPage() {
  const { data, hydrated } = useStore();
  const toast = useToast();
  const params = useSearchParams();
  const [greeting, setGreeting] = useState("");

  // Time-of-day greeting (client-only to avoid hydration mismatch)
  useEffect(() => {
    setGreeting(greetingFor(new Date()));
  }, []);

  // One-time post-onboarding welcome
  useEffect(() => {
    if (params.get("welcome") === "1") {
      toast.show({
        title: "Welcome to ONDC OneStep 🎉",
        description: "Your store is live across India's ONDC network.",
        variant: "success",
      });
    }
  }, [params, toast]);

  if (!hydrated) {
    return <div className="h-[600px] rounded-md bg-bg-card animate-pulse" />;
  }

  // FIRST-RUN: brand new with no orders yet
  if (!data.onboardingComplete || data.products.length === 0) {
    return <FirstRunDashboard storeName={data.storeName} verified={data.verified} />;
  }

  const firstName = data.ownerName.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[20px] border border-border bg-gradient-to-br from-bg-elevated via-bg-elevated to-bg-card p-6 lg:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[80px]" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-semibold text-accent mb-2">
            <span className="pulse-dot !w-1.5 !h-1.5 !bg-accent" />{" "}
            {greeting && `${greeting}, ${firstName}`}
          </div>
          <h2 className="font-display font-semibold text-[28px] lg:text-[36px] leading-tight">
            Your store made <span className="text-accent">₹24,580</span> today.
          </h2>
          <p className="mt-2 text-[14px] text-fg-muted max-w-[600px]">
            That&apos;s 18% above your daily average. 12 orders waiting for shipment —
            most are from Paytm.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/dashboard/orders?status=pending"
              className="btn-primary !py-2 !px-4 text-[13px]"
            >
              Process pending orders <span aria-hidden>→</span>
            </a>
            <a href="/dashboard/store" className="btn-ghost !py-2 !px-4 text-[13px]">
              Edit store
            </a>
          </div>
        </div>
      </motion.div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {baseMetrics.map((m, i) => (
          <MetricCard
            key={m.key}
            label={m.label}
            prefix={m.prefix}
            suffix={m.suffix}
            value={
              m.key === "orders"
                ? 47
                : m.key === "revenue"
                ? 24580
                : m.key === "views"
                ? 1247
                : 3.8
            }
            delta={
              m.key === "orders"
                ? "+12%"
                : m.key === "revenue"
                ? "+18%"
                : m.key === "views"
                ? "+34%"
                : "-0.2pp"
            }
            trend={m.key === "conversion" ? "down" : "up"}
            comparison="vs yesterday"
            index={i}
          />
        ))}
      </div>

      {/* Chart + Channel split */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="card-base">
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    i === 0
                      ? "bg-accent/15 text-accent"
                      : "text-fg-muted hover:bg-bg-card"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className="card-base">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[14px] font-semibold">Order Channels</div>
              <div className="text-[12px] text-fg-muted mt-0.5">Today · 47 orders</div>
            </div>
            <a
              href="/dashboard/network"
              className="text-[12px] text-accent hover:underline"
            >
              Manage →
            </a>
          </div>
          <div className="space-y-3">
            {channels.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span className="text-fg">{c.name}</span>
                  </div>
                  <span className="font-mono text-fg-muted">
                    {c.orders} · {c.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-bg-card overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: c.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance + AI insight + Tasks */}
      <div className="grid lg:grid-cols-[1fr_1fr_1fr] gap-4">
        <div className="card-base flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[14px] font-semibold">ONDC Performance</div>
              <div className="text-[12px] text-fg-muted mt-0.5">Refreshes hourly</div>
            </div>
            <span className="status-badge status-live">Healthy</span>
          </div>
          <div className="flex-1 flex items-center justify-center py-4">
            <Gauge value={82} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Latency" value="180ms" tint="var(--secondary)" />
            <MiniStat label="Uptime" value="99.8%" tint="var(--secondary)" />
            <MiniStat label="Disputes" value="0.4%" tint="var(--tertiary)" />
          </div>
        </div>

        <div
          className="rounded-[16px] border p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(123,97,255,0.10), rgba(255,107,53,0.04))",
            borderColor: "rgba(123,97,255,0.25)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-[#7B61FF]/15 blur-[60px] pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-[#9C82FF]">
                <span>✨</span> AI Insight
              </div>
              <button
                className="text-[11px] text-fg-muted hover:text-fg"
                onClick={() =>
                  toast.show({ title: "Dismissed", variant: "info" })
                }
              >
                Dismiss
              </button>
            </div>
            <p className="text-[15px] leading-relaxed">
              Your{" "}
              <span className="font-semibold">
                {data.products[0]?.name ?? "top product"}
              </span>{" "}
              is trending on Paytm — 3× higher views in 24h. Consider raising stock
              by 40 units before Friday.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="/dashboard/store/inventory"
                className="px-3 py-1.5 rounded-md bg-bg-elevated/60 border border-border hover:border-fg-muted/40 text-[12px] font-medium transition-colors"
              >
                Update inventory
              </a>
              <a
                href="#"
                className="px-3 py-1.5 rounded-md text-[12px] font-medium text-fg-muted hover:text-fg transition-colors"
              >
                See all insights →
              </a>
            </div>
          </div>
        </div>

        <HealthChecklist />
      </div>

      {/* Recent orders preview */}
      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[14px] font-semibold">Recent Orders</div>
            <div className="text-[12px] text-fg-muted mt-0.5">
              Showing last 5 of 47 today
            </div>
          </div>
          <a
            href="/dashboard/orders"
            className="text-[12px] text-accent hover:underline"
          >
            View all →
          </a>
        </div>
        <RecentOrders />
      </div>
    </div>
  );
}

function FirstRunDashboard({
  storeName,
  verified,
}: {
  storeName: string;
  verified: boolean;
}) {
  const steps = [
    { label: "Verify business", href: "/dashboard/settings", done: verified },
    { label: "Add products", href: "/dashboard/store/products", done: false },
    { label: "Connect payments", href: "/dashboard/settings", done: false },
    { label: "Choose logistics", href: "/dashboard/network", done: false },
  ];
  const completed = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[20px] border border-accent/30 bg-gradient-to-br from-accent/10 via-bg-elevated to-bg-card p-6 lg:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-accent/15 blur-[80px]" />
        <div className="relative">
          <div className="text-[12px] uppercase tracking-widest font-semibold text-accent mb-2">
            Welcome to ONDC OneStep
          </div>
          <h2 className="font-display font-semibold text-[28px] lg:text-[36px] leading-tight">
            Let&apos;s get{" "}
            <span className="text-accent">{storeName || "your store"}</span> ready.
          </h2>
          <p className="mt-2 text-[14px] text-fg-muted max-w-[600px]">
            A few quick steps and you&apos;re selling on Paytm, PhonePe, Magicpin and more.
          </p>

          <div className="mt-6 max-w-[400px]">
            <div className="flex items-center justify-between mb-2 text-[12px]">
              <span className="text-fg-muted">
                Setup progress · {completed}/{steps.length}
              </span>
              <span className="text-accent font-mono">
                {Math.round((completed / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-card overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completed / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {steps.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="card-base !p-5 flex items-center gap-4 hover:border-border-active transition-all"
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                s.done ? "bg-secondary" : "bg-bg-card border border-border"
              }`}
            >
              {s.done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l5 5L20 7"
                    stroke="var(--bg)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="text-[14px] font-display font-bold text-fg-muted">
                  {i + 1}
                </span>
              )}
            </span>
            <div className="flex-1">
              <div className="text-[14px] font-medium">{s.label}</div>
              <div className="text-[12px] text-fg-muted mt-0.5">
                {s.done ? "Done" : "Tap to continue →"}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="card-base">
        <EmptyState
          icon={<span aria-hidden>📊</span>}
          title="Your dashboard will fill up as orders come in"
          description="Once you have products live, you'll see orders, revenue, channel splits, and AI insights here."
          action={
            <a
              href="/dashboard/store/products"
              className="btn-primary !py-2.5 !px-5 text-[13px]"
            >
              Add products →
            </a>
          }
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  trend,
  prefix,
  suffix,
  comparison,
  index,
}: {
  label: string;
  value: number;
  delta: string;
  trend: "up" | "down";
  prefix?: string;
  suffix?: string;
  comparison: string;
  index: number;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const e = Math.min(1, (t - start) / 1200);
      const eased = 1 - Math.pow(1 - e, 3);
      setVal(value * eased);
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    const to = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, index * 60);
    return () => {
      clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [value, index]);

  const formatted =
    value >= 1000 && Number.isInteger(value)
      ? Math.round(val).toLocaleString("en-IN")
      : Number.isInteger(value)
      ? Math.round(val).toString()
      : val.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-base !p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] uppercase tracking-wider text-fg-muted font-medium">
          {label}
        </div>
        <span
          className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
            trend === "up"
              ? "bg-secondary/15 text-secondary"
              : "bg-danger/15 text-danger"
          }`}
          title={comparison}
        >
          {trend === "up" ? "↑" : "↓"} {delta}
        </span>
      </div>
      <div className="font-display font-bold text-[26px] lg:text-[30px] tracking-tight">
        {prefix ?? ""}
        {formatted}
        {suffix ?? ""}
      </div>
      <div className="text-[11px] text-fg-muted mt-1">{comparison}</div>
    </motion.div>
  );
}

function HealthChecklist() {
  const [tasks, setTasks] = useState([
    { id: "gst", label: "Update GST certificate", done: true },
    { id: "weights", label: "Add 12 missing product weights", done: false, urgent: true },
    { id: "cod", label: "Enable COD for orders <₹500", done: false },
    { id: "logistics2", label: "Connect 2nd logistics partner", done: false },
  ]);
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[14px] font-semibold">Store health checklist</div>
          <div className="text-[12px] text-fg-muted mt-0.5">
            {done} of {tasks.length} complete · {pct}%
          </div>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-bg-card overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setTasks((cur) =>
                cur.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))
              )
            }
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-bg-card transition-colors text-left"
          >
            <span
              className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                t.done ? "bg-secondary border-secondary" : "border-fg-muted/40"
              }`}
            >
              {t.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l5 5L20 7"
                    stroke="var(--bg)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className={`flex-1 text-[13px] ${
                t.done ? "text-fg-muted line-through" : "text-fg"
              }`}
            >
              {t.label}
            </span>
            {t.urgent && !t.done && (
              <span className="status-badge status-error !py-0.5">Urgent</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentOrders() {
  const orders = [
    { product: "Saffron Rice 5kg", icon: "🍚", buyer: "Paytm", amount: 540, status: "shipped", time: "12m ago" },
    { product: "Garam Masala 200g", icon: "🌶️", buyer: "PhonePe", amount: 180, status: "delivered", time: "1h ago" },
    { product: "Premium Cardamom", icon: "🟢", buyer: "Magicpin", amount: 820, status: "pending", time: "1h ago" },
    { product: "Spice Combo Pack", icon: "🎁", buyer: "Snapdeal", amount: 1240, status: "shipped", time: "2h ago" },
    { product: "Turmeric 1kg", icon: "🟡", buyer: "Meesho", amount: 290, status: "delivered", time: "3h ago" },
  ];
  return (
    <div className="space-y-1">
      {orders.map((o, i) => (
        <motion.a
          key={i}
          href="/dashboard/orders"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-2.5 px-3 rounded-md hover:bg-bg-card transition-colors"
        >
          <div className="w-9 h-9 rounded-md bg-bg-card border border-border flex items-center justify-center text-[16px]">
            {o.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-medium truncate">{o.product}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-fg-muted">
              {o.buyer} · {o.time}
            </div>
          </div>
          <div className="text-[14px] font-display font-semibold">₹{o.amount}</div>
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
        </motion.a>
      ))}
    </div>
  );
}

function RevenueChart() {
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
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    h - padding.y
  } L ${points[0].x} ${h - padding.y} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-[200px]"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="rev-fill-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="reveal-3">
          <rect x="0" y="0" width={w} height={h}>
            <animate
              attributeName="width"
              from="0"
              to={w}
              dur="1.2s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            />
          </rect>
        </clipPath>
      </defs>
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
      <g clipPath="url(#reveal-3)">
        <path d={areaPath} fill="url(#rev-fill-3)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--bg-elevated)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        ))}
      </g>
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

function Gauge({ value }: { value: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const [n, setN] = useState(0);

  useEffect(() => {
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
  }, [value]);

  return (
    <div className="relative w-[140px] h-[140px]">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bg-card)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
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

function MiniStat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-muted">
        {label}
      </div>
      <div
        className="text-[13px] font-display font-semibold"
        style={{ color: tint }}
      >
        {value}
      </div>
    </div>
  );
}
