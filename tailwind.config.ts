import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        "muted-light": "var(--color-muted-light)",
        border: "var(--color-border)",
        "border-dark": "var(--color-border-dark)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-fg": "var(--color-primary-fg)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        chrome: "var(--color-chrome)",
        "chrome-hover": "var(--color-chrome-hover)",
        danger: "var(--color-danger)",
        "danger-fg": "var(--color-danger-fg)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        title: ["1.5rem", { lineHeight: "1.3" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        caption: ["0.8125rem", { lineHeight: "1.5" }],
        small: ["0.75rem", { lineHeight: "1.4" }],
      },
      maxWidth: {
        content: "720px",
        page: "960px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 48s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;