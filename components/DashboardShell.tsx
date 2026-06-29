"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/storeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: OverviewIcon },
  { href: "/dashboard/store", label: "My Store", icon: StoreIcon },
  { href: "/dashboard/orders", label: "Orders", icon: OrdersIcon, badge: "12" },
  { href: "/dashboard/network", label: "Network", icon: NetworkIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

const commandList: { label: string; hint: string; href: string }[] = [
  { label: "Go to Overview", hint: "Dashboard home", href: "/dashboard" },
  { label: "Edit store", hint: "Storefront builder", href: "/dashboard/store" },
  { label: "View products", hint: "Catalog management", href: "/dashboard/store/products" },
  { label: "Inventory", hint: "Stock levels", href: "/dashboard/store/inventory" },
  { label: "Domain & SEO", hint: "Storefront settings", href: "/dashboard/store/domain" },
  { label: "Orders", hint: "Process incoming", href: "/dashboard/orders" },
  { label: "Network", hint: "Channels & flow", href: "/dashboard/network" },
  { label: "Account settings", hint: "Profile & preferences", href: "/dashboard/settings" },
  { label: "Security", hint: "2FA, sessions", href: "/dashboard/settings" },
  { label: "Billing", hint: "Plan & invoices", href: "/dashboard/settings" },
];

const notifications = [
  {
    id: "n1",
    title: "New order from Paytm",
    body: "Saffron Rice 5kg · ₹540",
    time: "Just now",
    unread: true,
    tint: "var(--accent)",
  },
  {
    id: "n2",
    title: "Low stock: Premium Cardamom",
    body: "12 units left. Customers waiting.",
    time: "1h ago",
    unread: true,
    tint: "var(--tertiary)",
  },
  {
    id: "n3",
    title: "Weekly payout settled",
    body: "₹84,200 sent to HDFC ••4821",
    time: "Yesterday",
    unread: false,
    tint: "var(--secondary)",
  },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, reset } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");

  const current =
    navItems.find((n) =>
      n.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(n.href)
    ) ?? navItems[0];

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close notif/menu on route change
  useEffect(() => {
    setNotifOpen(false);
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const filteredCommands = commandList.filter((c) =>
    cmdQuery
      ? c.label.toLowerCase().includes(cmdQuery.toLowerCase()) ||
        c.hint.toLowerCase().includes(cmdQuery.toLowerCase())
      : true
  );

  const handleSignOut = () => {
    reset();
    router.push("/");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const slug = data.storeName
    ? data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "your-store";
  const firstName = (data.ownerName || "You").split(" ")[0];
  const initial = (data.ownerName || "Y").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-[240px] border-r border-border bg-bg-elevated/40 shrink-0">
        <div className="px-6 h-[64px] flex items-center border-b border-border">
          <Link href="/" className="font-display font-bold text-[18px] tracking-tight">
            <span className="text-accent">ONDC</span>
            <span className="text-fg"> OneStep</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                  active
                    ? "bg-bg-card text-fg"
                    : "text-fg-muted hover:text-fg hover:bg-bg-card/50"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-accent"
                  />
                )}
                <Icon className={active ? "text-accent" : ""} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store status card */}
        <div className="m-3 p-3 rounded-lg bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="pulse-dot !w-1.5 !h-1.5" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">
              Store Live
            </span>
          </div>
          <div className="text-[13px] font-medium truncate">
            {data.storeName || "Your store"}
          </div>
          <div className="text-[11px] text-fg-muted mt-0.5 font-mono truncate">
            {slug}.onestep.in
          </div>
        </div>

        {/* User pill */}
        <div className="p-3 border-t border-border">
          <UserPill
            initial={initial}
            name={data.ownerName || "You"}
            onSignOut={handleSignOut}
          />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-bg/70 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[240px] bg-bg-elevated border-r border-border z-50 flex flex-col"
            >
              <div className="px-6 h-[64px] flex items-center border-b border-border">
                <Link href="/" className="font-display font-bold text-[18px] tracking-tight">
                  <span className="text-accent">ONDC</span>
                  <span className="text-fg"> OneStep</span>
                </Link>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium ${
                        active
                          ? "bg-bg-card text-fg"
                          : "text-fg-muted hover:bg-bg-card/50"
                      }`}
                    >
                      <Icon className={active ? "text-accent" : ""} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-[13px] hover:bg-bg-card rounded-md text-danger"
                >
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-[64px] flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border bg-bg/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-md hover:bg-bg-card flex items-center justify-center"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className="font-display font-semibold text-[18px] lg:text-[20px]">
              {current.label}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-card border border-border text-[12px] text-fg-muted hover:text-fg transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Search</span>
              <span className="ml-2 font-mono text-[10px] text-fg-muted/70">⌘K</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 rounded-md hover:bg-bg-card flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
                aria-label="Notifications"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16l-2-3z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 19a2 2 0 0 0 4 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-11 w-[340px] rounded-lg border border-border bg-bg-elevated shadow-elevated overflow-hidden z-40"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <div className="text-[14px] font-semibold">Notifications</div>
                      <span className="text-[11px] text-fg-muted">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg-card transition-colors ${
                            n.unread ? "bg-bg-card/40" : ""
                          }`}
                        >
                          <span
                            className="shrink-0 mt-1 w-2 h-2 rounded-full"
                            style={{
                              background: n.unread ? n.tint : "transparent",
                              border: n.unread ? "none" : `1px solid var(--border)`,
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium">{n.title}</div>
                            <div className="text-[12px] text-fg-muted">
                              {n.body}
                            </div>
                            <div className="text-[10px] text-fg-muted/70 mt-1 font-mono">
                              {n.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border text-center">
                      <button className="text-[12px] text-accent hover:underline">
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="lg:hidden relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-display font-bold text-[13px]"
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-11 w-[220px] rounded-lg border border-border bg-bg-elevated shadow-elevated p-1.5 z-40">
                  <div className="px-3 py-2.5 border-b border-border">
                    <div className="text-[13px] font-medium truncate">
                      {data.ownerName || "You"}
                    </div>
                    <div className="text-[11px] text-fg-muted truncate">
                      {data.ownerEmail || "—"}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-[13px] hover:bg-bg-card rounded-md text-danger"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>

      {/* Command palette */}
      <AnimatePresence>
        {cmdOpen && (
          <div
            className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4"
            onClick={() => setCmdOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[560px] rounded-[16px] bg-bg-elevated border border-border shadow-elevated overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  autoFocus
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  placeholder="Search pages, settings, products..."
                  className="flex-1 py-4 bg-transparent text-[14px] focus:outline-none placeholder-fg-muted/60"
                />
                <span className="text-[10px] font-mono text-fg-muted px-1.5 py-0.5 rounded bg-bg-card">
                  ESC
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto py-1">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-10 text-center text-[13px] text-fg-muted">
                    No matches for &ldquo;{cmdQuery}&rdquo;.
                  </div>
                ) : (
                  filteredCommands.map((c) => (
                    <button
                      key={c.href + c.label}
                      onClick={() => {
                        setCmdOpen(false);
                        setCmdQuery("");
                        router.push(c.href);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-bg-card transition-colors"
                    >
                      <div>
                        <div className="text-[14px] font-medium">{c.label}</div>
                        <div className="text-[12px] text-fg-muted">{c.hint}</div>
                      </div>
                      <span className="text-[11px] text-fg-muted/70 font-mono">↵</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserPill({
  initial,
  name,
  onSignOut,
}: {
  initial: string;
  name: string;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-bg-card transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-display font-bold text-[13px]">
          {initial}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[13px] font-medium truncate">{name}</div>
          <div className="text-[11px] text-fg-muted truncate">Pro plan</div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute bottom-12 left-0 right-0 rounded-lg border border-border bg-bg-elevated shadow-elevated p-1.5">
          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 text-[13px] hover:bg-bg-card rounded-md"
          >
            Account settings
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 text-[13px] hover:bg-bg-card rounded-md"
          >
            Billing
          </Link>
          <a
            href="#"
            className="block px-3 py-2 text-[13px] hover:bg-bg-card rounded-md"
          >
            Help & support
          </a>
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 text-[13px] hover:bg-bg-card rounded-md text-danger"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// Icons
function OverviewIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 7l1.5-3h15L21 7M3 7v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7M3 7h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function OrdersIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 2l2 4h8l2-4M4 6h16l-1.5 14a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2L4 6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function NetworkIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function SettingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
