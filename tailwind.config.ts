import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-card": "var(--bg-card)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        accent: "var(--accent)",
        "accent-glow": "var(--accent-glow)",
        secondary: "var(--secondary)",
        "secondary-glow": "var(--secondary-glow)",
        tertiary: "var(--tertiary)",
        danger: "var(--danger)",
        border: "var(--border)",
        "border-active": "var(--border-active)",
      },
      fontFamily: {
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": ["5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        display: ["4rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "h2-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h2: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        h3: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        micro: ["0.6875rem", { lineHeight: "1.4" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
        "5xl": "128px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px var(--border)",
        elevated: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--border)",
        "glow-accent":
          "0 0 40px var(--accent-glow), 0 0 80px rgba(255,107,53,0.1)",
        "glow-success": "0 0 30px var(--secondary-glow)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "packet-travel": {
          "0%": { offsetDistance: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { offsetDistance: "100%", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ring-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "ring-pulse": "ring-pulse 2.5s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
