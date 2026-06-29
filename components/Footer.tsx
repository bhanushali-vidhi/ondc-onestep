const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "ONDC Map", "API Docs", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Seller Guide", "Video Tutorials", "Blog"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "ONDC Policy", "Grievance Officer"],
  },
];

const socials = [
  { label: "X / Twitter", icon: "𝕏" },
  { label: "LinkedIn", icon: "in" },
  { label: "YouTube", icon: "▶" },
  { label: "Instagram", icon: "◎" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-elevated/40 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-[22px] tracking-tight mb-3">
              <span className="text-accent">ONDC</span>{" "}
              <span className="text-fg">OneStep</span>
            </div>
            <p className="text-[14px] text-fg-muted leading-relaxed max-w-[320px]">
              The fastest way to take your business live on the Open Network for
              Digital Commerce. One step. Sixty seconds.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-md bg-bg-card hover:bg-border hover:text-accent transition-colors flex items-center justify-center text-fg-muted text-[14px]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted mb-4">
                {c.title}
              </div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[14px] text-fg/80 hover:text-accent transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[12px] text-fg-muted">
          <div>© 2025 ONDC OneStep · Made in India</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="pulse-dot !w-1.5 !h-1.5" />
              <span>ONDC Network Participant</span>
            </span>
            <span className="text-border">·</span>
            <span className="font-mono">v0.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
