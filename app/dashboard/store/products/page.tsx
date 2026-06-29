"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStore, Product } from "@/lib/storeContext";
import { useToast } from "@/components/ui/Toast";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import Drawer from "@/components/ui/Drawer";

type FilterStatus = "all" | Product["status"];

const statusMeta: Record<Product["status"], { label: string; cls: string }> = {
  active: { label: "Active", cls: "status-live" },
  draft: { label: "Draft", cls: "status-pending" },
  out: { label: "Out of stock", cls: "status-error" },
};

export default function ProductsPage() {
  const { data, hydrated, addProduct, updateProduct, deleteProduct } = useStore();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStep, setUploadStep] = useState<"drop" | "parsing" | "review">("drop");
  const [parsed, setParsed] = useState<
    { name: string; price: number; stock: number; selected: boolean }[]
  >([]);

  const filtered = useMemo(() => {
    return data.products.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [data.products, status, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data.products.length };
    data.products.forEach((p) => (c[p.status] = (c[p.status] ?? 0) + 1));
    return c;
  }, [data.products]);

  const startMockUpload = () => {
    setUploadStep("parsing");
    setTimeout(() => {
      setParsed([
        { name: "Tellicherry Pepper 100g", price: 240, stock: 30, selected: true },
        { name: "Kashmiri Chilli Powder", price: 180, stock: 50, selected: true },
        { name: "Pure Asafoetida 50g", price: 110, stock: 25, selected: true },
        { name: "Star Anise 50g", price: 95, stock: 15, selected: false },
      ]);
      setUploadStep("review");
    }, 1600);
  };

  const confirmUpload = () => {
    const toAdd = parsed.filter((p) => p.selected);
    toAdd.forEach((p) =>
      addProduct({
        name: p.name,
        category: data.category,
        price: p.price,
        stock: p.stock,
        status: p.stock > 0 ? "active" : "out",
        emoji: "🌶️",
      })
    );
    setShowUpload(false);
    setUploadStep("drop");
    setParsed([]);
    toast.show({
      title: `${toAdd.length} products added`,
      description: "They're now live on your store and ONDC channels.",
      variant: "success",
    });
  };

  if (!hydrated) {
    return <div className="h-[400px] rounded-md bg-bg-card animate-pulse" />;
  }

  if (data.products.length === 0) {
    return (
      <>
        <div className="card-base">
          <EmptyState
            icon={<span aria-hidden>📦</span>}
            title="Add your first product"
            description="Upload a CSV, drop product photos, or add one manually. We'll handle ONDC sync."
            action={
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setShowUpload(true)}
                  className="btn-primary !py-2.5 !px-5 text-[13px]"
                >
                  Upload catalog
                </button>
                <button
                  onClick={() =>
                    setEditing({
                      id: "",
                      name: "",
                      category: data.category,
                      price: 0,
                      stock: 0,
                      status: "draft",
                      emoji: "📦",
                    })
                  }
                  className="btn-ghost !py-2.5 !px-5 text-[13px]"
                >
                  Add manually
                </button>
              </div>
            }
          />
        </div>
        <UploadModal
          open={showUpload}
          step={uploadStep}
          parsed={parsed}
          onClose={() => {
            setShowUpload(false);
            setUploadStep("drop");
          }}
          onStartParse={startMockUpload}
          onTogglePick={(i) =>
            setParsed((p) =>
              p.map((x, idx) => (idx === i ? { ...x, selected: !x.selected } : x))
            )
          }
          onConfirm={confirmUpload}
        />
        <EditDrawer
          product={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            if (p.id) {
              updateProduct(p.id, p);
              toast.show({ title: "Product updated", variant: "success" });
            } else {
              addProduct({
                name: p.name,
                category: p.category,
                price: p.price,
                stock: p.stock,
                status: p.status,
                emoji: p.emoji,
              });
              toast.show({ title: "Product added", variant: "success" });
            }
            setEditing(null);
          }}
        />
      </>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
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
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-bg-card border border-border text-fg text-[13px] focus:border-accent focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-bg-card border border-border">
            {(["all", "active", "draft", "out"] as FilterStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${
                  status === s
                    ? "bg-bg-elevated text-fg"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {s === "all" ? "All" : statusMeta[s].label}{" "}
                <span className="text-fg-muted/70 font-mono">
                  {counts[s] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 p-0.5 rounded-md bg-bg-card border border-border">
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded ${
                view === "table" ? "bg-bg-elevated text-fg" : "text-fg-muted"
              }`}
              aria-label="Table view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded ${
                view === "grid" ? "bg-bg-elevated text-fg" : "text-fg-muted"
              }`}
              aria-label="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-ghost !py-2 !px-3 text-[13px]"
          >
            Upload CSV
          </button>
          <button
            onClick={() =>
              setEditing({
                id: "",
                name: "",
                category: data.category,
                price: 0,
                stock: 0,
                status: "draft",
                emoji: "📦",
              })
            }
            className="btn-primary !py-2 !px-4 text-[13px]"
          >
            Add product
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" ? (
        <div className="card-base !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider font-semibold text-fg-muted border-b border-border">
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-fg-muted text-[14px]">
                      No products match those filters.
                    </td>
                  </tr>
                )}
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-bg-card border border-border flex items-center justify-center text-[18px] shrink-0">
                          {p.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14px] font-medium truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] font-mono text-fg-muted uppercase tracking-wider">
                            {p.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[14px] font-display font-semibold">
                      ₹{p.price}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[13px] font-mono ${
                          p.stock === 0
                            ? "text-danger"
                            : p.stock < 20
                            ? "text-tertiary"
                            : "text-fg"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`status-badge ${statusMeta[p.status].cls}`}>
                        {statusMeta[p.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => setEditing(p)}
                        className="text-[12px] text-accent hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          toast.show({
                            title: "Product deleted",
                            description: p.name,
                            variant: "info",
                          });
                        }}
                        className="text-[12px] text-fg-muted hover:text-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-border text-[12px] text-fg-muted">
            <span>
              Showing {filtered.length} of {data.products.length}
            </span>
            <span>
              {data.products.filter((p) => p.stock < 20 && p.stock > 0).length} low
              stock ·{" "}
              <span className="text-danger">
                {data.products.filter((p) => p.stock === 0).length} out
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.2) }}
              onClick={() => setEditing(p)}
              className="text-left rounded-[16px] bg-bg-elevated border border-border p-4 hover:border-border-active transition-colors"
            >
              <div
                className="w-full aspect-square rounded-md flex items-center justify-center text-[40px] mb-3"
                style={{
                  background: `linear-gradient(135deg, ${data.themeColor}25, ${data.themeColor}05)`,
                }}
              >
                {p.emoji}
              </div>
              <div className="text-[13px] font-medium truncate">{p.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[14px] font-display font-semibold">
                  ₹{p.price}
                </span>
                <span className={`status-badge ${statusMeta[p.status].cls} !py-0`}>
                  {statusMeta[p.status].label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <UploadModal
        open={showUpload}
        step={uploadStep}
        parsed={parsed}
        onClose={() => {
          setShowUpload(false);
          setUploadStep("drop");
        }}
        onStartParse={startMockUpload}
        onTogglePick={(i) =>
          setParsed((p) =>
            p.map((x, idx) => (idx === i ? { ...x, selected: !x.selected } : x))
          )
        }
        onConfirm={confirmUpload}
      />

      <EditDrawer
        product={editing}
        onClose={() => setEditing(null)}
        onSave={(p) => {
          if (p.id) {
            updateProduct(p.id, p);
            toast.show({ title: "Product updated", variant: "success" });
          } else {
            addProduct({
              name: p.name,
              category: p.category,
              price: p.price,
              stock: p.stock,
              status: p.status,
              emoji: p.emoji,
            });
            toast.show({ title: "Product added", variant: "success" });
          }
          setEditing(null);
        }}
      />
    </div>
  );
}

function UploadModal({
  open,
  step,
  parsed,
  onClose,
  onStartParse,
  onTogglePick,
  onConfirm,
}: {
  open: boolean;
  step: "drop" | "parsing" | "review";
  parsed: { name: string; price: number; stock: number; selected: boolean }[];
  onClose: () => void;
  onStartParse: () => void;
  onTogglePick: (i: number) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-[20px]">
              Upload catalog
            </h3>
            <p className="text-[13px] text-fg-muted mt-0.5">
              CSV, Excel, or drop product photos — we&apos;ll extract details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-md bg-bg-card hover:bg-border flex items-center justify-center text-fg-muted hover:text-fg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {step === "drop" && (
          <div className="space-y-4">
            <button
              onClick={onStartParse}
              className="w-full rounded-[16px] border-2 border-dashed border-border-active hover:border-accent transition-colors p-8 text-center bg-accent/5"
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

            <div className="flex items-center gap-3 text-[13px] text-fg-muted">
              <div className="flex-1 h-px bg-border" />
              <span>or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button className="w-full rounded-md py-3 bg-bg-card hover:bg-border border border-border text-[13px] font-medium transition-colors">
              Download CSV template
            </button>
          </div>
        )}

        {step === "parsing" && (
          <div className="py-10 text-center">
            <div className="inline-block w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin mb-4" />
            <div className="font-display font-semibold text-[16px]">
              Reading your catalog...
            </div>
            <div className="text-[13px] text-fg-muted mt-1">
              Extracting products, prices, and stock.
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="text-[13px] text-fg-muted">
              We found{" "}
              <span className="text-fg font-semibold">{parsed.length} products</span>.
              Uncheck any you don&apos;t want to add.
            </div>
            <div className="max-h-[320px] overflow-y-auto rounded-md border border-border">
              {parsed.map((p, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 p-3 border-b border-border last:border-0 cursor-pointer hover:bg-bg-card"
                >
                  <input
                    type="checkbox"
                    checked={p.selected}
                    onChange={() => onTogglePick(i)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="flex-1 text-[14px]">{p.name}</span>
                  <span className="text-[13px] font-mono text-fg-muted">
                    ₹{p.price}
                  </span>
                  <span className="text-[13px] font-mono text-fg-muted">
                    {p.stock} units
                  </span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-fg-muted">
                {parsed.filter((p) => p.selected).length} selected
              </span>
              <div className="flex gap-2">
                <button onClick={onClose} className="btn-ghost !py-2 !px-4 text-[13px]">
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={parsed.filter((p) => p.selected).length === 0}
                  className="btn-primary !py-2 !px-4 text-[13px] disabled:opacity-50"
                >
                  Add {parsed.filter((p) => p.selected).length} products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function EditDrawer({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [draft, setDraft] = useState<Product | null>(product);

  // Sync when product changes
  useMemo(() => {
    setDraft(product);
  }, [product]);

  if (!draft) return null;

  const isNew = !draft.id;

  return (
    <Drawer open={!!product} onClose={onClose}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-semibold text-fg-muted">
              {isNew ? "New product" : "Edit product"}
            </div>
            <h3 className="font-display font-bold text-[22px] mt-1">
              {draft.name || "Untitled"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-md bg-bg-card hover:bg-border flex items-center justify-center text-fg-muted hover:text-fg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 flex-1">
          <Field
            label="Product name"
            value={draft.name}
            onChange={(v) => setDraft({ ...draft, name: v })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price (₹)"
              type="number"
              value={String(draft.price)}
              onChange={(v) => setDraft({ ...draft, price: Number(v) || 0 })}
            />
            <Field
              label="Stock"
              type="number"
              value={String(draft.stock)}
              onChange={(v) => setDraft({ ...draft, stock: Number(v) || 0 })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
              Status
            </label>
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as Product["status"] })
              }
              className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
          <Field
            label="Emoji / icon"
            value={draft.emoji}
            onChange={(v) => setDraft({ ...draft, emoji: v })}
          />
        </div>

        <div className="flex gap-2 pt-6 border-t border-border mt-6">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center !py-2.5 text-[13px]">
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={!draft.name}
            className="btn-primary flex-1 justify-center !py-2.5 text-[13px] disabled:opacity-50"
          >
            {isNew ? "Add product" : "Save changes"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none transition-all"
      />
    </div>
  );
}
