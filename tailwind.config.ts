import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0E1A2B", soft: "#1E2D40", muted: "#5A6B80" },
        parchment: { DEFAULT: "#F6F3EC", deep: "#ECE6D8" },
        verify: { DEFAULT: "#0F766E", soft: "#CCFBF1", ink: "#0B5048" },
        flag: { DEFAULT: "#B45309", soft: "#FEF3C7" },
        danger: { DEFAULT: "#B91C1C", soft: "#FEE2E2" },
        line: "#DAD3C4",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "10px" },
      boxShadow: { card: "0 1px 2px rgba(14,26,43,0.06), 0 8px 24px -16px rgba(14,26,43,0.25)" },
    },
  },
  plugins: [],
};
export default config;
