# ONDC OneStep

Premium SaaS landing + product for the Open Network for Digital Commerce. Upload your catalog → live on Paytm, PhonePe, Magicpin & more in 60 seconds.

Built with Next.js 14 (App Router), Tailwind, Framer Motion, TypeScript.

## Pages

**Public**
- `/` — Marketing site (hero, one-step demo, live store builder, network map, dashboard preview, pricing, footer)
- `/login` — Sign in / sign up

**Onboarding**
- `/onboarding` — 6-step flow that delivers on the "60 seconds to live" promise

**App (post-login)**
- `/dashboard` — Overview with metrics, AI insight, performance gauge, channel split, store health checklist
- `/dashboard/store` — Storefront theme & branding (live phone preview)
- `/dashboard/store/products` — Catalog management with CSV upload, edit drawer, grid/table views
- `/dashboard/store/inventory` — Stock levels grouped by health
- `/dashboard/store/domain` — Subdomain, custom domain, SEO meta
- `/dashboard/orders` — Full table with status tabs, bulk select + actions, detail drawer with timeline
- `/dashboard/network` — Real my-order-flow visualization + grouped channel toggles (with disconnect confirmation)
- `/dashboard/settings` — Account, business, plan, notifications, security (2FA), danger zone (typed delete confirmation)

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Try the full flow

1. Visit `/` and click **Build Your Store**
2. On `/login`, switch to **Create an account** and submit — you'll land on `/onboarding`
3. Walk through the 6 steps; watch your store go live
4. Land on the dashboard with your real entered data
5. Add / edit products, process orders, toggle channels — everything persists in `localStorage`
6. Sign out from the user pill to reset

## Design system

See `tailwind.config.ts` and `app/globals.css` for tokens. The design is dark-first with coral-orange accent, premium SaaS aesthetic (no edtech playfulness, no government-portal staleness).

## Keyboard

- `⌘K` / `Ctrl+K` — Command palette
- `Esc` — Close any modal / panel
