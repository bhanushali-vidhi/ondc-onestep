"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MyNetworkFlow from "@/components/MyNetworkFlow";
import Toggle from "@/components/ui/Toggle";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/storeContext";

type Status = "live" | "syncing" | "issue";
type Conn = {
  name: string;
  type: "Buyer App" | "Logistics" | "Payment";
  status: Status;
  orders30d?: number;
  latency: string;
  enabled: boolean;
  icon: string;
  color: string;
};

const initial: Conn[] = [
  { name: "Paytm", type: "Buyer App", status: "live", orders30d: 412, latency: "180ms", enabled: true, icon: "P", color: "var(--accent)" },
  { name: "PhonePe", type: "Buyer App", status: "live", orders30d: 287, latency: "164ms", enabled: true, icon: "P", color: "var(--accent)" },
  { name: "Magicpin", type: "Buyer App", status: "live", orders30d: 156, latency: "210ms", enabled: true, icon: "M", color: "var(--accent)" },
  { name: "Snapdeal", type: "Buyer App", status: "syncing", orders30d: 89, latency: "240ms", enabled: true, icon: "S", color: "var(--accent)" },
  { name: "Meesho", type: "Buyer App", status: "live", orders30d: 134, latency: "195ms", enabled: true, icon: "M", color: "var(--accent)" },
  { name: "MyStore", type: "Buyer App", status: "live", orders30d: 42, latency: "175ms", enabled: false, icon: "M", color: "var(--accent)" },
  { name: "Delhivery", type: "Logistics", status: "live", orders30d: 380, latency: "Pickup ~4h", enabled: true, icon: "🚚", color: "var(--secondary)" },
  { name: "Dunzo", type: "Logistics", status: "live", orders30d: 290, latency: "Pickup ~45m", enabled: true, icon: "🛵", color: "var(--secondary)" },
  { name: "Shiprocket", type: "Logistics", status: "issue", orders30d: 110, latency: "Pickup ~6h", enabled: false, icon: "📦", color: "var(--secondary)" },
  { name: "UPI", type: "Payment", status: "live", latency: "Settle T+1", enabled: true, icon: "⚡", color: "var(--tertiary)" },
  { name: "Cards", type: "Payment", status: "live", latency: "Settle T+2", enabled: true, icon: "💳", color: "var(--tertiary)" },
  { name: "NetBanking", type: "Payment", status: "live", latency: "Settle T+1", enabled: true, icon: "🏦", color: "var(--tertiary)" },
];

const statusMap = {
  live: { label: "Live", cls: "status-live" },
  syncing: { label: "Syncing", cls: "status-pending" },
  issue: { label: "Issue", cls: "status-error" },
} as const;

export default function NetworkPage() {
  const { data } = useStore();
  const toast = useToast();
  const [conns, setConns] = useState(initial);
  const [pendingDisconnect, setPendingDisconnect] = useState<Conn | null>(null);

  const flowBuyers = useMemo(
    () =>
      conns
        .filter((c) => c.type === "Buyer App" && c.enabled)
        .map((c) => ({
          id: c.name,
          name: c.name,
          orders30d: c.orders30d ?? 0,
          status: c.status,
          color: c.color,
          side: "left" as const,
        })),
    [conns]
  );
  const flowLogistics = useMemo(
    () =>
      conns
        .filter((c) => c.type === "Logistics" && c.enabled)
        .map((c) => ({
          id: c.name,
          name: c.name,
          orders30d: c.orders30d ?? 0,
          status: c.status,
          color: c.color,
          side: "right" as const,
        })),
    [conns]
  );

  const summary = useMemo(() => {
    const connected = conns.filter((c) => c.enabled).length;
    const total = conns.length;
    const orders = conns
      .filter((c) => c.enabled)
      .reduce((a, c) => a + (c.orders30d ?? 0), 0);
    const issues = conns.filter((c) => c.enabled && c.status === "issue").length;
    return [
      { label: "Connected channels", value: connected, suffix: ` / ${total}`, color: "var(--secondary)" },
      { label: "Orders received · 30d", value: orders.toLocaleString("en-IN"), color: "var(--accent)" },
      { label: "Issues to resolve", value: issues, color: issues > 0 ? "var(--danger)" : "var(--secondary)" },
    ];
  }, [conns]);

  const toggle = (name: string) => {
    const c = conns.find((x) => x.name === name);
    if (!c) return;
    if (c.enabled && (c.orders30d ?? 0) > 50) {
      // Confirm before disconnecting a productive channel
      setPendingDisconnect(c);
      return;
    }
    applyToggle(name);
  };

  const applyToggle = (name: string) => {
    setConns((cs) =>
      cs.map((c) => (c.name === name ? { ...c, enabled: !c.enabled } : c))
    );
    const c = conns.find((x) => x.name === name);
    if (c) {
      toast.show({
        title: c.enabled ? `${c.name} disconnected` : `${c.name} reconnected`,
        description: c.enabled
          ? "Your store will stop appearing here within 5 minutes."
          : "Orders will start flowing again in a few minutes.",
        variant: c.enabled ? "warning" : "success",
      });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-[14px] text-fg-muted max-w-[640px]">
        Real-time view of every channel your store connects to. Buyer apps on the
        left send orders, logistics partners on the right pick them up.
      </p>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-base !p-5"
          >
            <div className="text-[12px] uppercase tracking-wider text-fg-muted font-medium">
              {s.label}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <div
                className="font-display font-bold text-[28px] tracking-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              {s.suffix && (
                <div className="text-[14px] text-fg-muted font-mono">{s.suffix}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flow viz */}
      <div className="card-base !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[14px] font-semibold">Order flow · last 30 days</div>
            <div className="text-[12px] text-fg-muted mt-0.5">
              Line thickness = order volume. Pulses = live activity.
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-fg-muted">
            <span className="pulse-dot !w-1.5 !h-1.5" /> Live
          </div>
        </div>
        <div className="p-4 lg:p-6">
          <MyNetworkFlow
            buyers={flowBuyers}
            logistics={flowLogistics}
            storeName={data.storeName || "Your Store"}
          />
        </div>
        <div className="px-6 py-3 border-t border-border flex items-center justify-between flex-wrap gap-3 text-[11px] text-fg-muted">
          <div className="flex flex-wrap items-center gap-4">
            <Legend color="var(--accent)" label="Incoming (buyer apps)" />
            <Legend color="var(--secondary)" label="Outgoing (logistics)" />
            <Legend color="var(--danger)" label="Issue" dashed />
          </div>
          <div>
            Payment rails work behind the scenes — see them below
          </div>
        </div>
      </div>

      {/* Connection list grouped */}
      {(["Buyer App", "Logistics", "Payment"] as const).map((type) => (
        <div key={type}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[18px]">
              {type === "Buyer App"
                ? "Buyer Apps"
                : type === "Logistics"
                ? "Logistics Partners"
                : "Payment Rails"}
            </h2>
            <span className="text-[12px] text-fg-muted">
              {conns.filter((c) => c.type === type && c.enabled).length} of{" "}
              {conns.filter((c) => c.type === type).length} active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {conns
              .filter((c) => c.type === type)
              .map((c) => (
                <ConnCard key={c.name} c={c} onToggle={() => toggle(c.name)} />
              ))}
          </div>
        </div>
      ))}

      <Modal open={!!pendingDisconnect} onClose={() => setPendingDisconnect(null)} size="sm">
        {pendingDisconnect && (
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-danger/15 flex items-center justify-center text-danger text-[20px] mb-4">
              !
            </div>
            <h3 className="font-display font-semibold text-[20px]">
              Disconnect {pendingDisconnect.name}?
            </h3>
            <p className="mt-2 text-[14px] text-fg-muted">
              You received{" "}
              <span className="text-fg font-semibold">
                {(pendingDisconnect.orders30d ?? 0).toLocaleString("en-IN")} orders
              </span>{" "}
              from {pendingDisconnect.name} in the last 30 days. Disconnecting hides
              your store from this channel — you can reconnect anytime.
            </p>
            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={() => setPendingDisconnect(null)}
                className="btn-ghost !py-2 !px-4 text-[13px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  applyToggle(pendingDisconnect.name);
                  setPendingDisconnect(null);
                }}
                className="px-4 py-2 rounded-md text-[13px] font-medium bg-danger/15 text-danger hover:bg-danger/25 border border-danger/30 transition-colors"
              >
                Disconnect anyway
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ConnCard({ c, onToggle }: { c: Conn; onToggle: () => void }) {
  return (
    <div
      className={`rounded-[16px] border p-4 transition-all ${
        c.enabled
          ? "bg-bg-elevated border-border"
          : "bg-bg-elevated/40 border-border opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-md bg-bg-card border border-border flex items-center justify-center text-[16px]">
            {c.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-medium truncate">{c.name}</div>
            <div className="text-[11px] uppercase tracking-wider text-fg-muted font-mono">
              {c.type}
            </div>
          </div>
        </div>
        <Toggle
          size="sm"
          checked={c.enabled}
          onChange={onToggle}
          ariaLabel={`${c.enabled ? "Disable" : "Enable"} ${c.name}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-muted">
            Status
          </div>
          <span className={`status-badge ${statusMap[c.status].cls} mt-1`}>
            {statusMap[c.status].label}
          </span>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-muted">
            {c.orders30d !== undefined ? "Orders 30d" : "Performance"}
          </div>
          <div className="text-[13px] font-display font-semibold mt-1">
            {c.orders30d !== undefined
              ? c.orders30d.toLocaleString("en-IN")
              : c.latency}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-6 h-0.5"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`
            : color,
        }}
      />
      <span>{label}</span>
    </div>
  );
}
