import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111111",
        muted: "#6b6b6b",
        "muted-light": "#9a9a9a",
        border: "#e5e5e5",
        "border-dark": "#d0d0d0",
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
    },
  },
  plugins: [],
};

export default config;
