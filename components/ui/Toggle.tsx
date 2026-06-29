"use client";

type Size = "sm" | "md";

const SIZES: Record<Size, { track: [number, number]; knob: number; gap: number }> = {
  // 36 × 20 track, 14 knob, 3 gap. Knob centered vertically; on-pos = 36-14-3 = 19px
  sm: { track: [36, 20], knob: 14, gap: 3 },
  // 48 × 26 track, 20 knob, 3 gap. On-pos = 48-20-3 = 25px
  md: { track: [48, 26], knob: 20, gap: 3 },
};

export default function Toggle({
  checked,
  onChange,
  size = "md",
  disabled = false,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  size?: Size;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const { track, knob, gap } = SIZES[size];
  const [w, h] = track;
  const top = (h - knob) / 2; // perfectly centered
  const onX = w - knob - gap;
  const offX = gap;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{ width: w, height: h }}
      className={`relative shrink-0 rounded-full transition-colors duration-200 ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-secondary" : "bg-bg-card border border-border"}`}
    >
      <span
        aria-hidden
        style={{
          width: knob,
          height: knob,
          top,
          left: 0,
          transform: `translateX(${checked ? onX : offX}px)`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
        className="absolute rounded-full bg-white transition-transform duration-200"
      />
    </button>
  );
}
