"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Toggle from "@/components/ui/Toggle";

const categories = [
  { key: "grocery", label: "Grocery", emoji: "🛒" },
  { key: "fashion", label: "Fashion", emoji: "👕" },
  { key: "electronics", label: "Electronics", emoji: "📱" },
  { key: "food", label: "Food", emoji: "🍱" },
  { key: "home", label: "Home", emoji: "🏠" },
  { key: "other", label: "Other", emoji: "✨" },
];

const themes = [
  { key: "coral", color: "#FF6B35" },
  { key: "emerald", color: "#00D68F" },
  { key: "violet", color: "#7B61FF" },
  { key: "amber", color: "#FFB800" },
];

const partners = [
  { key: "delhivery", label: "Delhivery" },
  { key: "dunzo", label: "Dunzo" },
  { key: "shiprocket", label: "Shiprocket" },
];

const buyerApps = ["Paytm", "PhonePe", "Magicpin"];

export type StoreBuilderValues = {
  storeName: string;
  category: string;
  themeColor: string;
  logo: string | null;
  ondcOn: boolean;
  logisticsOn: boolean;
};

export default function StoreBuilder({
  mode = "demo",
  initial,
  onSave,
}: {
  mode?: "demo" | "owner";
  initial?: Partial<StoreBuilderValues>;
  onSave?: (values: StoreBuilderValues) => void;
} = {}) {
  const [storeName, setStoreName] = useState(
    initial?.storeName ?? "Anjali's Spice Co."
  );
  const [category, setCategory] = useState(initial?.category ?? "grocery");
  const initialTheme =
    themes.find((t) => t.color === initial?.themeColor) ?? themes[0];
  const [theme, setTheme] = useState(initialTheme);
  const [logo, setLogo] = useState<string | null>(initial?.logo ?? null);
  const [ondcOn, setOndcOn] = useState(initial?.ondcOn ?? true);
  const [logisticsOn, setLogisticsOn] = useState(initial?.logisticsOn ?? true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Re-sync if initial values change (e.g., owner-mode hydration)
  useEffect(() => {
    if (!initial) return;
    if (initial.storeName !== undefined) setStoreName(initial.storeName);
    if (initial.category !== undefined) setCategory(initial.category);
    if (initial.themeColor !== undefined) {
      const t = themes.find((x) => x.color === initial.themeColor);
      if (t) setTheme(t);
    }
    if (initial.logo !== undefined) setLogo(initial.logo);
    if (initial.ondcOn !== undefined) setOndcOn(initial.ondcOn);
    if (initial.logisticsOn !== undefined) setLogisticsOn(initial.logisticsOn);
    setDirty(false);
  }, [
    initial?.storeName,
    initial?.category,
    initial?.themeColor,
    initial?.logo,
    initial?.ondcOn,
    initial?.logisticsOn,
  ]);

  // Mark dirty on user edits only (not first render)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDirty(true);
  }, [storeName, category, theme, logo, ondcOn, logisticsOn]);

  const handleSave = () => {
    if (!onSave) return;
    setSaving(true);
    setTimeout(() => {
      onSave({
        storeName,
        category,
        themeColor: theme.color,
        logo,
        ondcOn,
        logisticsOn,
      });
      setSaving(false);
      setDirty(false);
    }, 400);
  };

  const onLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const isDemo = mode === "demo";

  return (
    <section
      className={`relative overflow-hidden ${
        isDemo ? "py-[96px] lg:py-[128px]" : "py-6"
      }`}
    >
      {isDemo && (
        <>
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
        </>
      )}

      <div
        className={`relative ${
          isDemo ? "max-w-[1280px] mx-auto px-6 lg:px-8" : "px-4 sm:px-6 lg:px-8"
        }`}
      >
        {isDemo && (
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-bg-card border border-border text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-4">
              Try it now
            </div>
            <h2 className="font-display font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-tight tracking-tight">
              Build your store. Live preview.
            </h2>
            <p className="mt-4 text-[17px] text-fg-muted max-w-[600px] mx-auto">
              Every change reflects instantly. No &ldquo;Update Preview&rdquo; button required.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-start">
          {/* Builder form */}
          <div className="card-base !p-8">
            <div className="space-y-7">
              {/* Store Name */}
              <div>
                <label
                  htmlFor="store-name"
                  className="block text-[13px] font-medium text-fg-muted mb-2"
                >
                  Store Name
                </label>
                <input
                  id="store-name"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Anjali's Spice Co."
                  className="w-full px-4 py-3.5 rounded-md bg-bg-card border border-border text-fg placeholder-fg-muted/60 text-[15px] focus:border-accent focus:outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <div className="text-[13px] font-medium text-fg-muted mb-2">
                  Category
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`pill-chip ${
                        category === c.key ? "selected" : ""
                      }`}
                    >
                      <span aria-hidden>{c.emoji}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo */}
              <div>
                <div className="text-[13px] font-medium text-fg-muted mb-2">
                  Logo
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-bg-card border-2 border-dashed border-border hover:border-accent flex items-center justify-center overflow-hidden transition-all relative group"
                  >
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-fg-muted text-[24px] group-hover:text-accent transition-colors">
                        +
                      </span>
                    )}
                  </button>
                  <div className="text-[13px] text-fg-muted">
                    {logo ? (
                      <>
                        Looking sharp.{" "}
                        <button
                          onClick={() => setLogo(null)}
                          className="text-accent hover:underline"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      "Click to upload (any image)"
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onLogoSelect}
                    className="sr-only"
                  />
                </div>
              </div>

              {/* Theme */}
              <div>
                <div className="text-[13px] font-medium text-fg-muted mb-2">
                  Theme
                </div>
                <div className="flex gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t)}
                      aria-label={`Theme ${t.key}`}
                      className={`w-11 h-11 rounded-full transition-all ${
                        theme.key === t.key
                          ? "ring-2 ring-offset-2 ring-offset-bg-elevated scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{
                        background: t.color,
                        // @ts-ignore
                        "--tw-ring-color": t.color,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                <ToggleRow
                  label="Enable ONDC Discovery"
                  description="Get listed across Paytm, PhonePe, Magicpin & more."
                  checked={ondcOn}
                  onChange={setOndcOn}
                />
                <ToggleRow
                  label="Auto-pair Logistics"
                  description="We'll connect you with the best logistics partners automatically."
                  checked={logisticsOn}
                  onChange={setLogisticsOn}
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-3">
                <div className="text-[13px] text-fg-muted">
                  {isDemo ? (
                    <>👋 Like what you see? Sign up to make it yours.</>
                  ) : dirty ? (
                    <span className="text-tertiary">Unsaved changes</span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="pulse-dot !w-1.5 !h-1.5" />
                      <span>All changes saved · auto-syncs to ONDC in 30s</span>
                    </span>
                  )}
                </div>
                {isDemo ? (
                  <a
                    href="/login"
                    className="btn-primary !py-3 !px-6 text-[14px]"
                  >
                    Save & Launch <span aria-hidden>→</span>
                  </a>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={!dirty || saving}
                    className="btn-primary !py-3 !px-6 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-fg/30 border-t-fg animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phone Preview */}
          <PhonePreview
            storeName={storeName}
            category={category}
            theme={theme.color}
            logo={logo}
            ondcOn={ondcOn}
            logisticsOn={logisticsOn}
          />
        </div>
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">
        <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
      </div>
      <div>
        <div className="text-[15px] font-medium text-fg">{label}</div>
        <div className="text-[13px] text-fg-muted mt-0.5">{description}</div>
      </div>
    </div>
  );
}

function PhonePreview({
  storeName,
  category,
  theme,
  logo,
  ondcOn,
  logisticsOn,
}: {
  storeName: string;
  category: string;
  theme: string;
  logo: string | null;
  ondcOn: boolean;
  logisticsOn: boolean;
}) {
  const cat = categories.find((c) => c.key === category) ?? categories[0];

  return (
    <div className="relative mx-auto" aria-hidden="true">
      {/* ONDC nodes orbiting */}
      <AnimatePresence>
        {ondcOn && (
          <>
            {buyerApps.map((b, i) => {
              const angle = (i / buyerApps.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 180;
              const y = Math.sin(angle) * 180;
              return (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ delay: i * 0.1 }}
                  className="hidden lg:block absolute top-1/2 left-1/2 z-0 pointer-events-none"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div className="px-2.5 py-1 rounded-md bg-bg-elevated border border-accent/30 text-[10px] font-mono uppercase tracking-wider text-accent">
                    {b}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Logistics trucks */}
      <AnimatePresence>
        {logisticsOn && (
          <>
            {partners.map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="hidden lg:block absolute left-[-110px] z-0 pointer-events-none"
                style={{ top: `${30 + i * 80}px` }}
              >
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-bg-elevated border border-secondary/30 text-[10px] font-mono uppercase tracking-wider text-secondary">
                  <span>🚚</span>
                  {p.label}
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Phone frame */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto w-[280px] h-[576px] rounded-[44px] bg-[#1a1714] p-[10px] z-10"
        style={{
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(250,245,239,0.08)",
        }}
      >
        {/* Screen */}
        <div className="w-full h-full rounded-[34px] overflow-hidden bg-bg-elevated relative">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[80px] h-[24px] rounded-full bg-[#1a1714] z-20" />

          {/* Status bar */}
          <div className="pt-3 px-5 flex justify-between text-[10px] text-fg font-medium z-10 relative">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span>●●●</span>
              <span>100%</span>
            </span>
          </div>

          {/* Store header */}
          <div className="px-4 pt-5">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                style={{ background: theme }}
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-[18px] font-display font-bold">
                    {storeName.charAt(0).toUpperCase() || "S"}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <motion.div
                  key={storeName}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 0.15 }}
                  className="font-display font-semibold text-[14px] truncate"
                >
                  {storeName || "Your Store"}
                </motion.div>
                <div className="text-[10px] text-fg-muted flex items-center gap-1.5">
                  {ondcOn ? (
                    <>
                      <span className="pulse-dot !w-1.5 !h-1.5" />
                      <span>Live on ONDC · {cat.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-fg-muted/40" />
                      <span>Offline · {cat.label}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-bg-card text-[11px] text-fg-muted">
              Search {cat.label.toLowerCase()}...
            </div>

            {/* Category strip */}
            <div className="mt-4 flex gap-1.5 overflow-hidden">
              {[cat.label, "New", "Top", "Deals"].map((c, i) => (
                <div
                  key={i}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap ${
                    i === 0
                      ? "text-white"
                      : "bg-bg-card text-fg-muted border border-border"
                  }`}
                  style={i === 0 ? { background: theme } : undefined}
                >
                  {c}
                </div>
              ))}
            </div>

            {/* Product grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`${category}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg bg-bg-card border border-border overflow-hidden"
                >
                  <div
                    className="h-[70px] flex items-center justify-center text-[28px]"
                    style={{
                      background: `linear-gradient(135deg, ${theme}20, ${theme}05)`,
                    }}
                  >
                    {cat.emoji}
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-[10px] font-medium truncate">
                      {productName(cat.key, i)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-display font-bold"
                        style={{ color: theme }}
                      >
                        ₹{[120, 299, 450, 75][i]}
                      </span>
                      <button
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ background: theme }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function productName(cat: string, i: number) {
  const map: Record<string, string[]> = {
    grocery: ["Basmati Rice", "Fresh Tomatoes", "Spice Mix", "Whole Wheat"],
    fashion: ["Linen Kurta", "Cotton Saree", "Denim Jacket", "Silk Scarf"],
    electronics: ["Bluetooth Speaker", "USB Cable", "Power Bank", "Phone Stand"],
    food: ["Veg Thali", "Mango Lassi", "Paneer Tikka", "Masala Chai"],
    home: ["Brass Diya", "Cotton Throw", "Ceramic Pot", "Wall Art"],
    other: ["Mystery Box", "Gift Card", "Custom Order", "Bundle Pack"],
  };
  return map[cat]?.[i] ?? "Product";
}
