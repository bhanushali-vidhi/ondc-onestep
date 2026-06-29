"use client";

import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    blurb: "For makers testing the waters.",
    features: [
      "Up to 50 products",
      "ONDC listing",
      "Basic analytics",
      "1 logistics partner",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    blurb: "For real businesses growing on ONDC.",
    features: [
      "Unlimited products",
      "ONDC + direct storefront",
      "Advanced analytics + AI insights",
      "All logistics partners",
      "Priority ONDC discovery boost",
      "Custom domain",
    ],
    cta: "Go Pro",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "For brands at scale.",
    features: [
      "White-label",
      "Multi-store",
      "Dedicated ONDC support",
      "API access",
      "SLA guarantee",
    ],
    cta: "Talk to Us",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-[96px] lg:py-[128px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-bg-card border border-border text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-4">
            Pricing
          </div>
          <h2 className="font-display font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-tight tracking-tight">
            Start free. Pay when you grow.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-[560px] mx-auto">
            No setup fees. No platform charges on the free tier. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start max-w-[1100px] mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className={`relative rounded-[20px] p-8 transition-all duration-300 ${
                t.featured
                  ? "bg-gradient-to-b from-bg-elevated to-bg-card lg:py-10 lg:-mt-4"
                  : "bg-bg-elevated"
              }`}
              style={{
                border: t.featured
                  ? "1px solid rgba(255,107,53,0.4)"
                  : "1px solid var(--border)",
                boxShadow: t.featured
                  ? "0 24px 60px rgba(255,107,53,0.18), 0 0 0 1px rgba(255,107,53,0.25)"
                  : "var(--shadow-card)",
              }}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-fg text-[11px] font-semibold uppercase tracking-wider">
                  {t.badge}
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="font-display font-semibold text-[20px]">{t.name}</h3>
              </div>
              <p className="mt-1 text-[13px] text-fg-muted">{t.blurb}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display font-bold text-[44px] lg:text-[52px] tracking-tight">
                  {t.price}
                </span>
                {t.period && (
                  <span className="text-fg-muted text-[15px]">{t.period}</span>
                )}
              </div>

              <ul className="mt-7 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]">
                    <span
                      className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                        t.featured ? "bg-accent/20" : "bg-bg-card"
                      }`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12.5l5 5L20 7"
                          stroke={t.featured ? "var(--accent)" : "var(--fg-muted)"}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className={t.featured ? "text-fg" : "text-fg-muted"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/login"
                className={`mt-8 w-full justify-center ${
                  t.featured ? "btn-primary" : "btn-ghost"
                }`}
              >
                {t.cta}
                <span aria-hidden>→</span>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center text-[13px] text-fg-muted">
          All plans include: ONDC compliance · GST invoicing · 24/7 monitoring · Hindi & English support
        </div>
      </div>
    </section>
  );
}
