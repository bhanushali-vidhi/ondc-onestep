"use client";

import { useStore } from "@/lib/storeContext";
import { useToast } from "@/components/ui/Toast";

export default function InventoryPage() {
  const { data, hydrated, updateProduct } = useStore();
  const toast = useToast();

  if (!hydrated) {
    return <div className="h-[400px] rounded-md bg-bg-card animate-pulse" />;
  }

  const lowStock = data.products.filter((p) => p.stock > 0 && p.stock < 20);
  const outOfStock = data.products.filter((p) => p.stock === 0);
  const healthy = data.products.filter((p) => p.stock >= 20);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Healthy stock" value={healthy.length} tint="var(--secondary)" />
        <Stat label="Low stock" value={lowStock.length} tint="var(--tertiary)" />
        <Stat label="Out of stock" value={outOfStock.length} tint="var(--danger)" />
      </div>

      {[
        { title: "Out of stock", color: "var(--danger)", items: outOfStock },
        { title: "Low stock (< 20)", color: "var(--tertiary)", items: lowStock },
        { title: "Healthy stock", color: "var(--secondary)", items: healthy },
      ].map((group) => (
        <section key={group.title}>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: group.color }}
            />
            <h2 className="font-display font-semibold text-[16px]">
              {group.title}
            </h2>
            <span className="text-[12px] text-fg-muted">
              ({group.items.length})
            </span>
          </div>
          {group.items.length === 0 ? (
            <div className="text-[13px] text-fg-muted px-3 py-4 rounded-md bg-bg-card/50 border border-border">
              None — nice work.
            </div>
          ) : (
            <div className="card-base !p-0 overflow-hidden">
              {group.items.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < group.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-md bg-bg-card border border-border flex items-center justify-center text-[18px] shrink-0">
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{p.name}</div>
                    <div className="text-[12px] text-fg-muted">
                      ₹{p.price} · {p.stock} units
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      min={0}
                      className="w-20 px-2 py-1.5 rounded bg-bg-card border border-border text-[13px] font-mono text-center focus:border-accent focus:outline-none"
                      onBlur={(e) => {
                        const newStock = Math.max(0, Number(e.target.value) || 0);
                        if (newStock !== p.stock) {
                          updateProduct(p.id, {
                            stock: newStock,
                            status: newStock === 0 ? "out" : "active",
                          });
                          toast.show({
                            title: "Stock updated",
                            description: `${p.name}: ${newStock} units`,
                            variant: "success",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  tint,
}: {
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div className="card-base !p-5">
      <div className="text-[12px] uppercase tracking-wider text-fg-muted font-medium">
        {label}
      </div>
      <div
        className="mt-2 font-display font-bold text-[32px] tracking-tight"
        style={{ color: tint }}
      >
        {value}
      </div>
    </div>
  );
}
