import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta clínica-editorial: verde quirúrgico + papel + ámbar
        paper: {
          DEFAULT: "#f4efe6", // crema / papel de lámina anatómica
          dark: "#ebe3d4",
        },
        surgical: {
          50: "#eef6f4",
          100: "#d3e8e3",
          200: "#a8d2c9",
          300: "#72b3a7",
          400: "#479184",
          500: "#2f7568",
          600: "#235d53",
          700: "#1e4a44",
          800: "#1a3d39",
          900: "#163330",
        },
        amber: {
          DEFAULT: "#c8843a",
          light: "#e0a861",
          dark: "#a3672a",
        },
        ink: "#1c2622",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        plate: "0 1px 2px rgba(28,38,34,0.06), 0 8px 24px -8px rgba(28,38,34,0.12)",
        "plate-hover":
          "0 2px 4px rgba(28,38,34,0.08), 0 16px 40px -12px rgba(28,38,34,0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "draw-line": "draw-line 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
