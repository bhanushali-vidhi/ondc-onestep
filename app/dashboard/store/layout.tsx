"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/storeContext";

const tabs = [
  { href: "/dashboard/store", label: "Storefront", exact: true },
  { href: "/dashboard/store/products", label: "Products" },
  { href: "/dashboard/store/inventory", label: "Inventory" },
  { href: "/dashboard/store/domain", label: "Domain & SEO" },
];

export default function StoreSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data, hydrated } = useStore();

  const slug = data.storeName
    ? data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "your-store";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: data.themeColor || "var(--accent)" }}
            >
              {data.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-display font-bold text-[18px]">
                  {data.storeName?.charAt(0)?.toUpperCase() || "S"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-semibold text-[22px] truncate">
                {hydrated ? data.storeName || "Your Store" : "Loading..."}
              </h1>
              <div className="text-[12px] text-fg-muted font-mono truncate">
                {slug}.onestep.in
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://${slug}.onestep.in`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !py-2 !px-4 text-[13px]"
          >
            View live store <span aria-hidden>↗</span>
          </a>
          <span className="status-badge status-live">
            <span className="pulse-dot !w-1.5 !h-1.5" /> Live
          </span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 border-b border-border -mb-px overflow-x-auto">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors ${
                active ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="store-tab"
                  className="absolute left-2 right-2 -bottom-px h-[2px] bg-accent rounded-t"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
