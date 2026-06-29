"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Toggle from "@/components/ui/Toggle";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/storeContext";
import { useRouter } from "next/navigation";

const sections = [
  { id: "account", label: "Account" },
  { id: "business", label: "Business" },
  { id: "plan", label: "Plan & Billing" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "danger", label: "Danger Zone" },
];

export default function SettingsPage() {
  const [section, setSection] = useState("account");
  const { data, update, reset } = useStore();
  const toast = useToast();
  const router = useRouter();

  const [name, setName] = useState(data.ownerName);
  const [email, setEmail] = useState(data.ownerEmail);
  const [phone, setPhone] = useState("+91 98XXX XX901");

  const [businessName, setBusinessName] = useState(data.storeName);
  const [gstin, setGstin] = useState(data.gstin);
  const [pan, setPan] = useState(data.pan);
  const [address, setAddress] = useState("No. 42, Spice Lane, Bengaluru 560001");
  const [bank, setBank] = useState("HDFC •••• 4821");

  const [orderEmail, setOrderEmail] = useState(true);
  const [orderSMS, setOrderSMS] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [weekly, setWeekly] = useState(true);

  const [twoFA, setTwoFA] = useState(false);
  const [pauseConfirm, setPauseConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const saveAccount = () => {
    update({ ownerName: name, ownerEmail: email });
    toast.show({ title: "Account updated", variant: "success" });
  };
  const saveBusiness = () => {
    update({ storeName: businessName, gstin, pan });
    toast.show({ title: "Business details saved", variant: "success" });
  };

  return (
    <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-10">
      <aside>
        <nav className="lg:sticky lg:top-[80px] space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                section === s.id
                  ? "bg-bg-card text-fg"
                  : "text-fg-muted hover:text-fg hover:bg-bg-card/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="space-y-6 min-w-0">
        {section === "account" && (
          <Block title="Account" description="Your personal sign-in info.">
            <Field label="Full name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field
              label="Phone (for OTP)"
              value={phone}
              onChange={setPhone}
              type="tel"
            />
            <div className="pt-4 border-t border-border">
              <button
                onClick={saveAccount}
                className="btn-primary !py-2 !px-5 text-[13px]"
              >
                Save changes
              </button>
            </div>
          </Block>
        )}

        {section === "business" && (
          <Block
            title="Business details"
            description="ONDC requires this info to keep your store compliant."
          >
            <Field label="Legal business name" value={businessName} onChange={setBusinessName} />
            <Field label="GSTIN" value={gstin} onChange={setGstin} mono />
            <Field label="PAN" value={pan} onChange={setPan} mono />
            <Field
              label="Registered address"
              value={address}
              onChange={setAddress}
              multiline
            />
            <Field label="Bank account (for payouts)" value={bank} onChange={setBank} mono />
            {data.verified && (
              <div className="rounded-md p-4 bg-secondary/10 border border-secondary/30 flex items-start gap-3">
                <span className="text-secondary text-[16px]">✓</span>
                <div className="text-[13px]">
                  <div className="font-medium text-secondary">Verified by ONDC</div>
                  <div className="text-fg-muted mt-0.5">
                    All your KYC documents are verified. Last checked 12 days ago.
                  </div>
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-border">
              <button
                onClick={saveBusiness}
                className="btn-primary !py-2 !px-5 text-[13px]"
              >
                Save changes
              </button>
            </div>
          </Block>
        )}

        {section === "plan" && (
          <Block title="Plan & Billing" description="Manage your subscription and view invoices.">
            <div className="rounded-[16px] border border-accent/30 p-5 bg-gradient-to-br from-accent/10 to-transparent relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-accent/15 blur-[60px] pointer-events-none" />
              <div className="relative flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-accent">
                    Current Plan
                  </div>
                  <div className="font-display font-bold text-[28px] mt-1">Pro</div>
                  <div className="text-[13px] text-fg-muted">
                    ₹999/mo · Renews 12 Jul 2026
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toast.show({
                        title: "Plan comparison",
                        description: "Opening plan picker...",
                        variant: "info",
                      })
                    }
                    className="btn-ghost !py-2 !px-4 text-[13px]"
                  >
                    Change plan
                  </button>
                  <button
                    onClick={() =>
                      toast.show({
                        title: "Redirecting to payment portal",
                        description: "Opens Razorpay in a new tab.",
                        variant: "info",
                      })
                    }
                    className="btn-primary !py-2 !px-4 text-[13px]"
                  >
                    Manage billing
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[13px] font-medium text-fg-muted mb-3">
                Recent invoices
              </div>
              <div className="rounded-md border border-border overflow-hidden">
                {[
                  { date: "12 Jun 2026", amount: 999, status: "paid" },
                  { date: "12 May 2026", amount: 999, status: "paid" },
                  { date: "12 Apr 2026", amount: 999, status: "paid" },
                ].map((inv, i, arr) => (
                  <div
                    key={inv.date}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i < arr.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[13px]">{inv.date}</span>
                      <span className="status-badge status-live">paid</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-display font-semibold">
                        ₹{inv.amount}
                      </span>
                      <button
                        onClick={() =>
                          toast.show({ title: "Invoice download starting…", variant: "info" })
                        }
                        className="text-[12px] text-accent hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Block>
        )}

        {section === "notifications" && (
          <Block title="Notifications" description="What we ping you about, and where.">
            <NotifRow
              label="New orders"
              description="Real-time alerts when an order comes in"
              email={orderEmail}
              sms={orderSMS}
              onEmail={setOrderEmail}
              onSMS={setOrderSMS}
            />
            <NotifRow
              label="Weekly summary"
              description="Friday digest of your store's performance"
              email={weekly}
              sms={false}
              onEmail={setWeekly}
              onSMS={() => {}}
              smsDisabled
            />
            <NotifRow
              label="Marketing & tips"
              description="Product updates, growth tips, and ONDC announcements"
              email={marketing}
              sms={false}
              onEmail={setMarketing}
              onSMS={() => {}}
              smsDisabled
            />
            <div className="pt-4 border-t border-border">
              <button
                onClick={() =>
                  toast.show({ title: "Notification preferences saved", variant: "success" })
                }
                className="btn-primary !py-2 !px-5 text-[13px]"
              >
                Save changes
              </button>
            </div>
          </Block>
        )}

        {section === "security" && (
          <Block
            title="Security"
            description="Protect your store and payouts."
          >
            <SecurityRow
              title="Password"
              description="Last changed 3 months ago. Consider rotating quarterly."
              action={
                <button className="btn-ghost !py-2 !px-4 text-[13px]">
                  Change password
                </button>
              }
            />
            <SecurityRow
              title="Two-factor authentication"
              description="Required for payouts and ONDC settings changes."
              action={
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={twoFA}
                    onChange={(v) => {
                      setTwoFA(v);
                      toast.show({
                        title: v ? "2FA enabled" : "2FA disabled",
                        description: v
                          ? "Scan the QR code in your authenticator app."
                          : "You should re-enable this soon.",
                        variant: v ? "success" : "warning",
                      });
                    }}
                  />
                </div>
              }
            />
            <SecurityRow
              title="Active sessions"
              description="2 devices · Bengaluru (this device), Mumbai"
              action={
                <button
                  onClick={() =>
                    toast.show({
                      title: "Other sessions signed out",
                      variant: "success",
                    })
                  }
                  className="btn-ghost !py-2 !px-4 text-[13px]"
                >
                  Sign out others
                </button>
              }
            />
            <SecurityRow
              title="API keys"
              description="0 keys · Pro feature for headless integrations."
              action={
                <button
                  onClick={() =>
                    toast.show({ title: "API key created", variant: "success" })
                  }
                  className="btn-ghost !py-2 !px-4 text-[13px]"
                >
                  Create key
                </button>
              }
            />
          </Block>
        )}

        {section === "danger" && (
          <Block title="Danger Zone" description="Irreversible actions. Take a breath.">
            <DangerRow
              title="Pause store"
              description="Temporarily hide your store from ONDC. Existing orders continue."
              cta="Pause store"
              onClick={() => setPauseConfirm(true)}
            />
            <DangerRow
              title="Delete store"
              description="Permanently remove your store, products, and ONDC listing. Order history is retained for 7 years per regulations."
              cta="Delete store"
              destructive
              onClick={() => setDeleteConfirm(true)}
            />
          </Block>
        )}
      </div>

      {/* Pause confirm */}
      <Modal open={pauseConfirm} onClose={() => setPauseConfirm(false)} size="sm">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-tertiary/15 flex items-center justify-center text-tertiary text-[20px] mb-4">
            ⏸
          </div>
          <h3 className="font-display font-semibold text-[20px]">Pause store?</h3>
          <p className="mt-2 text-[14px] text-fg-muted">
            Your store will be hidden from all ONDC buyer apps within 5 minutes.
            Existing orders will continue to process. You can unpause anytime.
          </p>
          <div className="mt-6 flex gap-2 justify-end">
            <button
              onClick={() => setPauseConfirm(false)}
              className="btn-ghost !py-2 !px-4 text-[13px]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setPauseConfirm(false);
                update({ ondcOn: false });
                toast.show({
                  title: "Store paused",
                  description: "It's hidden from ONDC buyer apps.",
                  variant: "warning",
                });
              }}
              className="px-4 py-2 rounded-md text-[13px] font-medium bg-tertiary/15 text-tertiary hover:bg-tertiary/25 border border-tertiary/30 transition-colors"
            >
              Pause store
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm — typed confirmation */}
      <Modal open={deleteConfirm} onClose={() => {
        setDeleteConfirm(false);
        setDeleteText("");
      }} size="md">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-danger/15 flex items-center justify-center text-danger text-[22px] mb-4">
            ⚠
          </div>
          <h3 className="font-display font-semibold text-[20px]">
            Delete this store?
          </h3>
          <p className="mt-2 text-[14px] text-fg-muted">
            This will permanently remove{" "}
            <span className="text-fg font-semibold">{data.storeName}</span> from
            ONDC and your storefront. Your products, settings, and integrations
            will be deleted. <span className="text-danger font-medium">This can&apos;t be undone.</span>
          </p>

          <div className="mt-5">
            <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
              Type{" "}
              <span className="font-mono text-fg">{data.storeName}</span> to confirm
            </label>
            <input
              autoFocus
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-danger focus:outline-none transition-all font-mono"
            />
          </div>

          <div className="mt-6 flex gap-2 justify-end">
            <button
              onClick={() => {
                setDeleteConfirm(false);
                setDeleteText("");
              }}
              className="btn-ghost !py-2 !px-4 text-[13px]"
            >
              Cancel
            </button>
            <button
              disabled={deleteText !== data.storeName}
              onClick={() => {
                reset();
                toast.show({
                  title: "Store deleted",
                  description: "Sorry to see you go.",
                  variant: "info",
                });
                setTimeout(() => router.push("/"), 600);
              }}
              className="px-4 py-2 rounded-md text-[13px] font-medium bg-danger text-white hover:bg-danger/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Delete forever
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Block({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      key={title}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h2 className="font-display font-semibold text-[22px] tracking-tight">
          {title}
        </h2>
        <p className="text-[13px] text-fg-muted mt-1">{description}</p>
      </div>
      <div className="card-base space-y-5">{children}</div>
    </motion.section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-fg-muted mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={`w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none transition-all resize-none ${
            mono ? "font-mono" : ""
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-md bg-bg-card border border-border text-fg text-[14px] focus:border-accent focus:outline-none transition-all ${
            mono ? "font-mono" : ""
          }`}
        />
      )}
    </div>
  );
}

function NotifRow({
  label,
  description,
  email,
  sms,
  onEmail,
  onSMS,
  smsDisabled,
}: {
  label: string;
  description: string;
  email: boolean;
  sms: boolean;
  onEmail: (b: boolean) => void;
  onSMS: (b: boolean) => void;
  smsDisabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium">{label}</div>
        <div className="text-[12px] text-fg-muted mt-0.5">{description}</div>
      </div>
      <div className="flex items-center gap-5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-fg-muted">Email</span>
          <Toggle size="sm" checked={email} onChange={onEmail} ariaLabel={`Email ${label}`} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[12px] ${smsDisabled ? "text-fg-muted/40" : "text-fg-muted"}`}
          >
            SMS
          </span>
          <Toggle
            size="sm"
            checked={sms}
            onChange={onSMS}
            disabled={smsDisabled}
            ariaLabel={`SMS ${label}`}
          />
        </div>
      </div>
    </div>
  );
}

function SecurityRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border last:border-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium">{title}</div>
        <div className="text-[12px] text-fg-muted mt-0.5">{description}</div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function DangerRow({
  title,
  description,
  cta,
  onClick,
  destructive,
}: {
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border last:border-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium">{title}</div>
        <div className="text-[12px] text-fg-muted mt-0.5">{description}</div>
      </div>
      <button
        onClick={onClick}
        className={`shrink-0 px-4 py-2 rounded-md text-[13px] font-medium border transition-colors ${
          destructive
            ? "border-danger/40 text-danger hover:bg-danger/10"
            : "border-border text-fg-muted hover:text-fg hover:border-fg-muted/40"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
