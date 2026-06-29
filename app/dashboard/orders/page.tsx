"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";

type Status = "pending" | "shipped" | "delivered" | "cancelled";
type Order = {
  id: string;
  product: string;
  icon: string;
  qty: number;
  buyer: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  amount: number;
  status: Status;
  placedAt: string;
  time: string;
  paymentMethod: string;
  note?: string;
};

const seed: Order[] = [
  { id: "ONS-4821", product: "Saffron Rice 5kg", icon: "🍚", qty: 1, buyer: "Paytm", customer: "Ravi K.", phone: "+91 98XXX XX901", address: "12 MG Road, Indiranagar", city: "Bengaluru", amount: 540, status: "shipped", placedAt: "Today, 2:18 PM", time: "12m ago", paymentMethod: "UPI · paytm@axis" },
  { id: "ONS-4820", product: "Garam Masala 200g", icon: "🌶️", qty: 2, buyer: "PhonePe", customer: "Meera S.", phone: "+91 99XXX XX442", address: "Sector 14, Aundh", city: "Pune", amount: 180, status: "delivered", placedAt: "Today, 1:30 PM", time: "1h ago", paymentMethod: "UPI · meera@ybl" },
  { id: "ONS-4819", product: "Premium Cardamom", icon: "🟢", qty: 1, buyer: "Magicpin", customer: "Anish R.", phone: "+91 80XXX XX112", address: "Banjara Hills, Rd 12", city: "Hyderabad", amount: 820, status: "pending", placedAt: "Today, 1:15 PM", time: "1h ago", paymentMethod: "Cards · Visa ••6612", note: "Please ring twice." },
  { id: "ONS-4818", product: "Spice Combo Pack", icon: "🎁", qty: 3, buyer: "Snapdeal", customer: "Priya M.", phone: "+91 90XXX XX787", address: "Bandra West, Linking Rd", city: "Mumbai", amount: 1240, status: "shipped", placedAt: "Today, 12:02 PM", time: "2h ago", paymentMethod: "NetBanking" },
  { id: "ONS-4817", product: "Turmeric 1kg", icon: "🟡", qty: 1, buyer: "Meesho", customer: "Suresh L.", phone: "+91 95XXX XX001", address: "T Nagar, Burkit Road", city: "Chennai", amount: 290, status: "delivered", placedAt: "Today, 11:00 AM", time: "3h ago", paymentMethod: "UPI · suresh@okhdfcbank" },
  { id: "ONS-4816", product: "Black Pepper 250g", icon: "⚫", qty: 1, buyer: "Paytm", customer: "Divya N.", phone: "+91 94XXX XX554", address: "Ernakulam, Marine Dr", city: "Kochi", amount: 320, status: "pending", placedAt: "Today, 10:48 AM", time: "3h ago", paymentMethod: "COD" },
  { id: "ONS-4815", product: "Mustard Seeds 500g", icon: "🟤", qty: 2, buyer: "PhonePe", customer: "Karthik V.", phone: "+91 99XXX XX120", address: "HSR Layout, Sector 7", city: "Bengaluru", amount: 240, status: "delivered", placedAt: "Today, 9:30 AM", time: "4h ago", paymentMethod: "UPI" },
  { id: "ONS-4814", product: "Coriander Powder", icon: "🟢", qty: 1, buyer: "Magicpin", customer: "Asha P.", phone: "+91 88XXX XX998", address: "Vasant Kunj, Sector C", city: "Delhi", amount: 95, status: "delivered", placedAt: "Today, 9:01 AM", time: "5h ago", paymentMethod: "UPI" },
  { id: "ONS-4813", product: "Saffron Rice 5kg", icon: "🍚", qty: 2, buyer: "Direct", customer: "Vikram J.", phone: "+91 97XXX XX045", address: "Navrangpura, Civil Ln", city: "Ahmedabad", amount: 1080, status: "shipped", placedAt: "Today, 8:42 AM", time: "5h ago", paymentMethod: "Cards" },
  { id: "ONS-4812", product: "Cinnamon Sticks", icon: "🟤", qty: 1, buyer: "Paytm", customer: "Reena K.", phone: "+91 93XXX XX772", address: "Malviya Nagar", city: "Jaipur", amount: 220, status: "cancelled", placedAt: "Today, 8:10 AM", time: "6h ago", paymentMethod: "UPI · refund pending" },
  { id: "ONS-4811", product: "Cumin Seeds 1kg", icon: "🟫", qty: 1, buyer: "Meesho", customer: "Sandeep B.", phone: "+91 96XXX XX331", address: "Hazratganj", city: "Lucknow", amount: 360, status: "delivered", placedAt: "Yesterday, 11:45 PM", time: "7h ago", paymentMethod: "UPI" },
  { id: "ONS-4810", product: "Spice Combo Pack", icon: "🎁", qty: 1, buyer: "PhonePe", customer: "Tara S.", phone: "+91 89XXX XX112", address: "Park Street", city: "Kolkata", amount: 410, status: "pending", placedAt: "Yesterday, 10:20 PM", time: "8h ago", paymentMethod: "UPI · tara@ybl" },
];

const tabs: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const buyers = ["All channels", "Paytm", "PhonePe", "Magicpin", "Snapdeal", "Meesho", "Direct"];

const statusMap = {
  pending: { label: "Pending", cls: "status-pending" },
  shipped: { label: "Shipped", cls: "status-pending" },
  delivered: { label: "Delivered", cls: "status-live" },
  cancelled: { label: "Cancelled", cls: "status-error" },
} as const;

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>(seed);
  const [tab, setTab] = useState<"all" | Status>("all");
  const [buyer, setBuyer] = useState("All channels");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (buyer !== "All channels" && o.buyer !== buyer) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !o.product.toLowerCase().includes(q) &&
          !o.id.toLowerCase().includes(q) &&
          !o.customer.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [orders, tab, buyer, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
    return c;
  }, [orders]);

  const allChecked =
    filtered.length > 0 && filtered.every((o) => selected.has(o.id));

  const toggleAll = () => {
    if (allChecked) {
      const next = new Set(selected);
      filtered.forEach((o) => next.delete(o.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      filtered.forEach((o) => next.add(o.id));
      setSelected(next);
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const markShipped = () => {
    const count = selected.size;
    setOrders((cur) =>
      cur.map((o) =>
        selected.has(o.id) && o.status === "pending" ? { ...o, status: "shipped" as Status } : o
      )
    );
    setSelected(new Set());
    toast.show({
      title: `${count} orders marked shipped`,
      description: "Tracking IDs sent to customers via SMS.",
      variant: "success",
    });
  };

  const exportCSV = () => {
    const rows = [
      ["Order ID", "Product", "Qty", "Channel", "Customer", "Amount", "Status", "Time"],
      ...filtered.map((o) => [
        o.id,
        o.product,
        String(o.qty),
        o.buyer,
        o.customer,
        String(o.amount),
        o.status,
        o.time,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show({
      title: `Exported ${filtered.length} orders`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <p className="text-[14px] text-fg-muted max-w-[640px]">
          All orders across every ONDC buyer app and your direct storefront. Filter,
          search, and act on them from one place.
        </p>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="btn-ghost !py-2 !px-4 text-[13px]"
          >
            Export CSV
          </button>
          <button
            disabled={selected.size === 0}
            onClick={() =>
              toast.show({
                title: `${selected.size} labels queued`,
                description: "Opening print preview...",
                variant: "info",
              })
            }
            className="btn-primary !py-2 !px-4 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Print labels {selected.size > 0 && `(${selected.size})`}
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-[64px] z-20 flex items-center justify-between gap-3 px-4 py-2.5 rounded-md bg-accent/10 border border-accent/30 backdrop-blur"
        >
          <div className="text-[13px] font-medium">
            <span className="text-accent font-semibold">{selected.size}</span>{" "}
            selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markShipped}
              className="px-3 py-1.5 rounded text-[12px] font-medium bg-bg-elevated/80 hover:bg-bg-elevated border border-border"
            >
              Mark shipped
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-[12px] text-fg-muted hover:text-fg px-2"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.key ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            <span className="flex items-center gap-2">
              {t.label}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  tab === t.key
                    ? "bg-accent/15 text-accent"
                    : "bg-bg-card text-fg-muted"
                }`}
              >
                {counts[t.key] ?? 0}
              </span>
            </span>
            {tab === t.key && (
              <motion.span
                layoutId="orders-tab-active"
                className="absolute left-2 right-2 -bottom-px h-[2px] bg-accent rounded-t"
              />
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[340px]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product, ID, or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-md bg-bg-card border border-border text-fg text-[13px] focus:border-accent focus:outline-none transition-all"
          />
        </div>
        <select
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
          className="px-3 py-2 rounded-md bg-bg-card border border-border text-fg text-[13px] focus:border-accent focus:outline-none"
        >
          {buyers.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card-base !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider font-semibold text-fg-muted border-b border-border">
                <th className="py-3 pl-5 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-accent"
                    aria-label="Select all"
                  />
                </th>
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-5 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-fg-muted text-[14px]">
                    No orders match those filters.
                  </td>
                </tr>
              )}
              {filtered.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  onClick={(e) => {
                    // Don't open drawer when clicking checkbox
                    const target = e.target as HTMLElement;
                    if (target.tagName === "INPUT") return;
                    setActive(o);
                  }}
                  className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 pl-5 pr-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(o.id)}
                      onChange={() => toggleOne(o.id)}
                      className="w-4 h-4 accent-accent"
                      aria-label={`Select ${o.id}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-bg-card border border-border flex items-center justify-center text-[16px] shrink-0">
                        {o.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium truncate">
                          {o.product}
                        </div>
                        <div className="text-[11px] font-mono text-fg-muted">
                          {o.id} · qty {o.qty}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[13px] font-mono uppercase tracking-wider text-fg-muted">
                      {o.buyer}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[13px]">{o.customer}</div>
                    <div className="text-[11px] text-fg-muted">{o.city}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[14px] font-display font-semibold">
                      ₹{o.amount}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`status-badge ${statusMap[o.status].cls}`}>
                      {statusMap[o.status].label}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <span className="text-[12px] text-fg-muted">{o.time}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-[12px] text-fg-muted">
          <span>
            Showing {filtered.length} of {orders.length}
          </span>
          <span className="flex items-center gap-3">
            Click any row to see details
          </span>
        </div>
      </div>

      {/* Detail drawer */}
      <OrderDetail
        order={active}
        onClose={() => setActive(null)}
        onMarkShipped={() => {
          if (!active) return;
          setOrders((cur) =>
            cur.map((o) =>
              o.id === active.id ? { ...o, status: "shipped" as Status } : o
            )
          );
          setActive({ ...active, status: "shipped" });
          toast.show({
            title: "Marked as shipped",
            description: `Tracking ID sent to ${active.customer}.`,
            variant: "success",
          });
        }}
      />
    </div>
  );
}

function OrderDetail({
  order,
  onClose,
  onMarkShipped,
}: {
  order: Order | null;
  onClose: () => void;
  onMarkShipped: () => void;
}) {
  const timeline =
    order &&
    [
      { label: "Order placed", time: order.placedAt, done: true },
      {
        label: "Payment received",
        time: "Auto-confirmed",
        done: order.status !== "cancelled",
      },
      {
        label: "Shipped",
        time:
          order.status === "shipped" || order.status === "delivered"
            ? "Just now"
            : "Pending",
        done: order.status === "shipped" || order.status === "delivered",
      },
      {
        label: "Delivered",
        time: order.status === "delivered" ? "Delivered" : "Pending",
        done: order.status === "delivered",
      },
    ];

  return (
    <Drawer open={!!order} onClose={onClose} width={520}>
      {order && (
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted">
                  Order
                </div>
                <h3 className="font-display font-bold text-[22px] mt-1 font-mono">
                  {order.id}
                </h3>
                <div className="text-[13px] text-fg-muted mt-1">{order.placedAt}</div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-md bg-bg-card hover:bg-border flex items-center justify-center text-fg-muted hover:text-fg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`status-badge ${statusMap[order.status].cls}`}>
                {statusMap[order.status].label}
              </span>
              <span className="text-[12px] text-fg-muted font-mono uppercase tracking-wider">
                via {order.buyer}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Items */}
            <div className="p-6 border-b border-border">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted mb-3">
                Items
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-bg-card border border-border flex items-center justify-center text-[20px] shrink-0">
                  {order.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium truncate">
                    {order.product}
                  </div>
                  <div className="text-[12px] text-fg-muted">
                    Qty {order.qty} · ₹{order.amount / order.qty} each
                  </div>
                </div>
                <div className="text-[15px] font-display font-semibold">
                  ₹{order.amount}
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="p-6 border-b border-border">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted mb-3">
                Customer
              </div>
              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between gap-3">
                  <span className="text-fg-muted">Name</span>
                  <span>{order.customer}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-fg-muted">Phone</span>
                  <span className="font-mono">{order.phone}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-fg-muted">Address</span>
                  <span className="text-right max-w-[60%]">
                    {order.address}, {order.city}
                  </span>
                </div>
              </div>
              {order.note && (
                <div className="mt-3 p-3 rounded-md bg-tertiary/10 border border-tertiary/30 text-[13px]">
                  <span className="text-tertiary font-semibold">Note from buyer: </span>
                  {order.note}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="p-6 border-b border-border">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted mb-3">
                Payment
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-fg-muted">{order.paymentMethod}</span>
                <span className="font-display font-semibold">₹{order.amount}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted mb-4">
                Timeline
              </div>
              <div className="space-y-4 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {timeline!.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <span
                      className={`shrink-0 w-3.5 h-3.5 rounded-full mt-1 ${
                        t.done ? "bg-accent" : "bg-bg-card border border-border"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-[13px] font-medium ${
                          t.done ? "text-fg" : "text-fg-muted"
                        }`}
                      >
                        {t.label}
                      </div>
                      <div className="text-[12px] text-fg-muted">{t.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border flex gap-2">
            {order.status === "pending" && (
              <button
                onClick={onMarkShipped}
                className="btn-primary flex-1 justify-center !py-2.5 text-[13px]"
              >
                Mark as shipped
              </button>
            )}
            {order.status === "shipped" && (
              <button className="btn-ghost flex-1 justify-center !py-2.5 text-[13px]">
                Track shipment
              </button>
            )}
            <button className="btn-ghost !py-2.5 !px-4 text-[13px]">
              Contact buyer
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
