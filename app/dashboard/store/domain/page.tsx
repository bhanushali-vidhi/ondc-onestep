"use client";

import { useState } from "react";
import { useStore } from "@/lib/storeContext";
import { useToast } from "@/components/ui/Toast";

export default function DomainSEOPage() {
  const { data } = useStore();
  const toast = useToast();
  const [customDomain, setCustomDomain] = useState("");
  const [metaTitle, setMetaTitle] = useState(
    `${data.storeName} · Premium spices, delivered fast`
  );
  const [metaDesc, setMetaDesc] = useState(
    "Authentic Indian spices sourced directly from farms. Live on ONDC."
  );

  const slug = data.storeName
    ? data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "your-store";

  return (
    <div className="space-y-6 max-w-[720px]">
      {/* Subdomain */}
      <section className="card-base">
        <h2 className="font-display font-semibold text-[18px]">
          Default subdomain
        </h2>
        <p className="text-[13px] text-fg-muted mt-1">
          Your free OneStep subdomain. Always available.
        </p>
        <div className="mt-4 flex items-center rounded-md bg-bg-card border border-border overflow-hidden font-mono text-[14px]">
          <span className="px-3 py-3 text-fg-muted">https://</span>
          <span className="px-1 py-3 text-fg">{slug}</span>
          <span className="px-3 py-3 text-fg-muted">.onestep.in</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`https://${slug}.onestep.in`);
              toast.show({ title: "URL copied", variant: "info" });
            }}
            className="ml-auto px-4 py-3 text-[12px] text-accent hover:bg-accent/10 border-l border-border"
          >
            Copy
          </button>
        </div>
      </section>

      {/* Custom domain */}
      <section className="card-base">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display font-semibold text-[18px]">
              Custom domain
            </h2>
            <p className="text-[13px] text-fg-muted mt-1">
              Use your own domain like <span className="font-mono">shop.yourbrand.in</span>.
            </p>
          </div>
          <span className="status-badge status-pending">Pro feature</span>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="shop.yourbrand.in"
            className="flex-1 px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none"
          />
          <button
            disabled={!customDomain}
            onClick={() =>
              toast.show({
                title: "Domain queued for verification",
                description: "We'll email you DNS instructions in a moment.",
                variant: "info",
              })
            }
            className="btn-primary !py-2.5 !px-5 text-[13px] disabled:opacity-50"
          >
            Connect
          </button>
        </div>
      </section>

      {/* SEO */}
      <section className="card-base space-y-4">
        <div>
          <h2 className="font-display font-semibold text-[18px]">SEO & sharing</h2>
          <p className="text-[13px] text-fg-muted mt-1">
            What shows up in Google search and when your link is shared.
          </p>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
            Meta title ({metaTitle.length}/60)
          </label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={60}
            className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
            Meta description ({metaDesc.length}/160)
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none resize-none"
          />
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-border">
          <div className="text-[12px] uppercase tracking-wider font-semibold text-fg-muted mb-3">
            Google preview
          </div>
          <div className="rounded-md p-4 bg-white text-black">
            <div className="text-[14px] text-[#1a0dab] truncate">{metaTitle}</div>
            <div className="text-[12px] text-[#006621] mt-0.5">
              {slug}.onestep.in
            </div>
            <div className="text-[13px] text-[#545454] mt-1 line-clamp-2">
              {metaDesc}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() =>
              toast.show({ title: "SEO settings saved", variant: "success" })
            }
            className="btn-primary !py-2.5 !px-5 text-[13px]"
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
