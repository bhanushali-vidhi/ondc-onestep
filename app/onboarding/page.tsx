"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/storeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

const STEPS = [
  "Business",
  "Catalog",
  "Review",
  "Payments",
  "Logistics",
  "Go Live",
] as const;

const categories = [
  { key: "grocery", label: "Grocery", emoji: "🛒" },
  { key: "fashion", label: "Fashion", emoji: "👕" },
  { key: "electronics", label: "Electronics", emoji: "📱" },
  { key: "food", label: "Food", emoji: "🍱" },
  { key: "home", label: "Home", emoji: "🏠" },
  { key: "other", label: "Other", emoji: "✨" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data, hydrated, update, addProduct, setOnboarded } = useStore();
  const [step, setStep] = useState(0);

  // Business step state
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("grocery");
  const [gstin, setGstin] = useState("");

  // Catalog step
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<
    { name: string; price: number; stock: number; selected: boolean; emoji: string }[]
  >([]);

  // Payments
  const [upi, setUpi] = useState("");

  // Logistics
  const [logistics, setLogistics] = useState<string[]>(["delhivery", "dunzo"]);

  // Go-live animation
  const [liveProgress, setLiveProgress] = useState(0);
  const [liveStage, setLiveStage] = useState(0);
  const liveStages = [
    "Verifying business...",
    "Pushing catalog to ONDC...",
    "Pairing logistics...",
    "Activating payments...",
    "Going live...",
  ];

  useEffect(() => {
    if (step !== 5) return;
    setLiveProgress(0);
    setLiveStage(0);
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.min(100, (elapsed / 6000) * 100);
      setLiveProgress(pct);
      setLiveStage(Math.min(liveStages.length - 1, Math.floor(pct / 20)));
      if (pct < 100) raf = requestAnimationFrame(tick);
      else {
        // Persist everything and head to dashboard
        setTimeout(() => {
          update({
            storeName,
            category,
            gstin,
            onboardingComplete: true,
            verified: true,
            ondcOn: true,
            logisticsOn: logistics.length > 0,
          });
          parsed
            .filter((p) => p.selected)
            .forEach((p) =>
              addProduct({
                name: p.name,
                category,
                price: p.price,
                stock: p.stock,
                status: p.stock > 0 ? "active" : "out",
                emoji: p.emoji,
              })
            );
          setOnboarded(true);
          try {
            localStorage.removeItem("ondc-onestep:fresh");
          } catch {}
          router.push("/dashboard?welcome=1");
        }, 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const validateBusiness = storeName.trim().length >= 2 && gstin.trim().length >= 6;
  const validatePayments = upi.trim().length >= 4 || upi === "skip";

  const startMockUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const map: Record<string, typeof parsed> = {
        grocery: [
          { name: "Basmati Rice 5kg", price: 540, stock: 40, selected: true, emoji: "🍚" },
          { name: "Garam Masala 200g", price: 180, stock: 120, selected: true, emoji: "🌶️" },
          { name: "Cardamom 100g", price: 320, stock: 30, selected: true, emoji: "🟢" },
          { name: "Turmeric 1kg", price: 290, stock: 80, selected: true, emoji: "🟡" },
        ],
        fashion: [
          { name: "Linen Kurta", price: 1200, stock: 24, selected: true, emoji: "👕" },
          { name: "Cotton Saree", price: 2400, stock: 12, selected: true, emoji: "🥻" },
          { name: "Denim Jacket", price: 1800, stock: 18, selected: true, emoji: "🧥" },
        ],
        electronics: [
          { name: "Bluetooth Speaker", price: 1490, stock: 22, selected: true, emoji: "🔊" },
          { name: "USB-C Cable 2m", price: 290, stock: 100, selected: true, emoji: "🔌" },
          { name: "Power Bank 10K", price: 1290, stock: 35, selected: true, emoji: "🔋" },
        ],
        food: [
          { name: "Veg Thali", price: 180, stock: 50, selected: true, emoji: "🍱" },
          { name: "Paneer Tikka", price: 220, stock: 30, selected: true, emoji: "🍢" },
          { name: "Masala Chai", price: 40, stock: 100, selected: true, emoji: "🍵" },
        ],
        home: [
          { name: "Brass Diya Set", price: 540, stock: 22, selected: true, emoji: "🪔" },
          { name: "Cotton Throw", price: 890, stock: 14, selected: true, emoji: "🛋️" },
          { name: "Wall Art Print", price: 1200, stock: 8, selected: true, emoji: "🖼️" },
        ],
        other: [
          { name: "Sample Product 1", price: 299, stock: 20, selected: true, emoji: "✨" },
          { name: "Sample Product 2", price: 499, stock: 15, selected: true, emoji: "✨" },
        ],
      };
      setParsed(map[category] ?? map.other);
      setUploading(false);
    }, 1600);
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-6 lg:px-8 h-[64px] flex items-center justify-between border-b border-border bg-bg/80 backdrop-blur-xl sticky top-0 z-30">
        <Link href="/" className="font-display font-bold text-[18px] tracking-tight">
          <span className="text-accent">ONDC</span>
          <span className="text-fg"> OneStep</span>
        </Link>
        <div className="text-[12px] text-fg-muted hidden sm:block">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => {
              setOnboarded(true);
              router.push("/dashboard");
            }}
            className="text-[12px] text-fg-muted hover:text-fg"
          >
            Skip for now →
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-bg-card relative">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-accent"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step content */}
      <main className="flex-1 px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-[680px] mx-auto">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-accent mb-2">
            <span>Step {step + 1}</span>
            <span className="text-fg-muted">/ {STEPS.length}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <>
                  <h1 className="font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                    Tell us about your business.
                  </h1>
                  <p className="mt-2 text-[15px] text-fg-muted">
                    The basics — we&apos;ll use this to register you on ONDC.
                  </p>
                  <div className="mt-8 space-y-5">
                    <Field
                      label="Store name"
                      value={storeName}
                      onChange={setStoreName}
                      placeholder="e.g. Anjali's Spice Co."
                    />
                    <div>
                      <div className="block text-[12px] font-medium text-fg-muted mb-2">
                        What do you sell?
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
                    <Field
                      label="GSTIN"
                      value={gstin}
                      onChange={setGstin}
                      placeholder="15-digit GSTIN"
                      mono
                    />
                    <div className="rounded-md p-3 bg-secondary/10 border border-secondary/30 flex items-start gap-2 text-[12px]">
                      <span className="text-secondary">✓</span>
                      <span>
                        Verified GSTIN gets your store ONDC-approved instantly.
                      </span>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                    Show us your catalog.
                  </h1>
                  <p className="mt-2 text-[15px] text-fg-muted">
                    Upload a CSV, drop photos, or skip and add products later.
                  </p>

                  {!parsed.length && !uploading && (
                    <div className="mt-8 space-y-3">
                      <button
                        onClick={startMockUpload}
                        className="w-full rounded-[16px] border-2 border-dashed border-border-active hover:border-accent transition-colors p-10 text-center bg-accent/5"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-accent/15 mx-auto mb-3 flex items-center justify-center text-accent text-[24px]">
                          📁
                        </div>
                        <div className="font-display font-semibold text-[16px]">
                          Drop your catalog here
                        </div>
                        <div className="text-[13px] text-fg-muted mt-1">
                          or click to browse · CSV, XLSX, or images
                        </div>
                      </button>
                      <button
                        onClick={() => setParsed([])}
                        className="w-full rounded-md py-3 bg-bg-card hover:bg-border border border-border text-[13px] font-medium transition-colors"
                      >
                        Download CSV template
                      </button>
                    </div>
                  )}

                  {uploading && (
                    <div className="mt-8 py-10 text-center">
                      <div className="inline-block w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin mb-4" />
                      <div className="font-display font-semibold text-[16px]">
                        Reading your catalog...
                      </div>
                    </div>
                  )}

                  {parsed.length > 0 && !uploading && (
                    <div className="mt-8">
                      <div className="text-[13px] text-fg-muted mb-3">
                        Found{" "}
                        <span className="text-fg font-semibold">{parsed.length} products</span>.
                        Uncheck any you don&apos;t want.
                      </div>
                      <div className="rounded-md border border-border">
                        {parsed.map((p, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-3 p-3 border-b border-border last:border-0 cursor-pointer hover:bg-bg-card"
                          >
                            <input
                              type="checkbox"
                              checked={p.selected}
                              onChange={() =>
                                setParsed((cur) =>
                                  cur.map((x, idx) =>
                                    idx === i ? { ...x, selected: !x.selected } : x
                                  )
                                )
                              }
                              className="w-4 h-4 accent-accent"
                            />
                            <span className="text-[16px]" aria-hidden>
                              {p.emoji}
                            </span>
                            <span className="flex-1 text-[14px]">{p.name}</span>
                            <span className="text-[13px] font-mono text-fg-muted">
                              ₹{p.price}
                            </span>
                            <span className="text-[13px] font-mono text-fg-muted">
                              {p.stock}u
                            </span>
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={() => setParsed([])}
                        className="mt-3 text-[12px] text-fg-muted hover:text-fg"
                      >
                        ← Re-upload
                      </button>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                    Quick review.
                  </h1>
                  <p className="mt-2 text-[15px] text-fg-muted">
                    Make sure this looks right before we go live.
                  </p>
                  <div className="mt-8 card-base">
                    <ReviewRow label="Store name" value={storeName} />
                    <ReviewRow
                      label="Category"
                      value={
                        categories.find((c) => c.key === category)?.label ?? category
                      }
                    />
                    <ReviewRow label="GSTIN" value={gstin} mono last />
                  </div>
                  <div className="mt-4 card-base">
                    <div className="text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-3">
                      Catalog · {parsed.filter((p) => p.selected).length} products
                    </div>
                    {parsed.filter((p) => p.selected).length === 0 ? (
                      <div className="text-[13px] text-fg-muted">
                        No products yet — that&apos;s fine, you can add them later.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-[13px]">
                        {parsed
                          .filter((p) => p.selected)
                          .slice(0, 6)
                          .map((p, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 px-2 py-1.5 rounded bg-bg-card"
                            >
                              <span aria-hidden>{p.emoji}</span>
                              <span className="flex-1 truncate">{p.name}</span>
                              <span className="font-mono text-fg-muted">
                                ₹{p.price}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                    Where do payouts go?
                  </h1>
                  <p className="mt-2 text-[15px] text-fg-muted">
                    UPI ID is fastest. Bank transfers are settled T+1.
                  </p>
                  <div className="mt-8 space-y-4">
                    <Field
                      label="UPI ID"
                      value={upi === "skip" ? "" : upi}
                      onChange={setUpi}
                      placeholder="yourname@bank"
                      mono
                    />
                    <button
                      onClick={() => setUpi("skip")}
                      className="text-[12px] text-fg-muted hover:text-fg"
                    >
                      I&apos;ll set this up later →
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h1 className="font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                    Pick logistics partners.
                  </h1>
                  <p className="mt-2 text-[15px] text-fg-muted">
                    Multi-select. We&apos;ll auto-route every order to the best option.
                  </p>
                  <div className="mt-8 space-y-3">
                    {[
                      { id: "delhivery", name: "Delhivery", reach: "18,800+ pincodes", emoji: "🚚" },
                      { id: "dunzo", name: "Dunzo", reach: "8 metros · 45m delivery", emoji: "🛵" },
                      { id: "shiprocket", name: "Shiprocket", reach: "Pan-India · 17 couriers", emoji: "📦" },
                    ].map((p) => {
                      const on = logistics.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() =>
                            setLogistics((cur) =>
                              cur.includes(p.id)
                                ? cur.filter((x) => x !== p.id)
                                : [...cur, p.id]
                            )
                          }
                          className={`w-full flex items-center gap-4 p-4 rounded-[16px] border text-left transition-all ${
                            on
                              ? "bg-accent/10 border-accent/40"
                              : "bg-bg-elevated border-border hover:border-fg-muted/40"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-md bg-bg-card border border-border flex items-center justify-center text-[20px]">
                            {p.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-medium">{p.name}</div>
                            <div className="text-[12px] text-fg-muted">{p.reach}</div>
                          </div>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              on ? "bg-accent" : "border border-border"
                            }`}
                          >
                            {on && (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M5 12.5l5 5L20 7"
                                  stroke="var(--bg)"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {step === 5 && (
                <div className="text-center pt-6">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block relative"
                  >
                    <div
                      className="w-28 h-28 rounded-full bg-accent flex items-center justify-center font-display font-bold text-[40px] text-fg relative overflow-hidden"
                      style={{
                        boxShadow:
                          "0 20px 60px rgba(255,107,53,0.4), 0 0 0 8px rgba(255,107,53,0.1)",
                      }}
                    >
                      {storeName.charAt(0).toUpperCase() || "S"}
                    </div>
                    {liveProgress >= 100 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-secondary border-4 border-bg flex items-center justify-center"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12.5l5 5L20 7"
                            stroke="var(--bg)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                  <h1 className="mt-8 font-display font-semibold text-[32px] lg:text-[40px] leading-tight tracking-tight">
                    {liveProgress < 100 ? "Launching your store..." : "You're live!"}
                  </h1>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={liveStage}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-2 text-[15px] text-fg-muted h-6"
                    >
                      {liveProgress < 100
                        ? liveStages[liveStage]
                        : "Heading to your dashboard..."}
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-8 max-w-[400px] mx-auto">
                    <div className="h-2 rounded-full bg-bg-card overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${liveProgress}%`,
                          background:
                            liveProgress >= 100
                              ? "var(--secondary)"
                              : "var(--accent)",
                        }}
                      />
                    </div>
                    <div className="mt-2 text-[12px] font-mono text-fg-muted">
                      {Math.round(liveProgress)}%
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          {step < 5 && (
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={prev}
                disabled={step === 0}
                className="text-[13px] text-fg-muted hover:text-fg disabled:opacity-30"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                {step === 1 && parsed.length === 0 && !uploading && (
                  <button
                    onClick={next}
                    className="text-[13px] text-fg-muted hover:text-fg"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={
                    (step === 0 && !validateBusiness) ||
                    (step === 1 && (uploading || parsed.length === 0)) ||
                    (step === 3 && !validatePayments) ||
                    (step === 4 && logistics.length === 0)
                  }
                  className="btn-primary !py-2.5 !px-5 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 4 ? "Take me live →" : "Continue →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[15px] focus:border-accent focus:outline-none transition-all ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

function ReviewRow({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center gap-3 py-3 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <span className="text-[13px] text-fg-muted">{label}</span>
      <span
        className={`text-[14px] font-medium ${mono ? "font-mono" : ""} text-right`}
      >
        {value || <span className="text-fg-muted italic">Not set</span>}
      </span>
    </div>
  );
}
