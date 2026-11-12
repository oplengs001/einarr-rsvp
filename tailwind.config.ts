import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        ink: "#1b1b1f",
        azure: { DEFAULT: "#5cc2f0", light: "#a8defa" },
        sea: { DEFAULT: "#0d4a8a", light: "#2f86cf", dark: "#082f5a" },
        luffy: { DEFAULT: "#e2312d", dark: "#b8211e" },
        sun: { DEFAULT: "#ffcc1f", dark: "#e9b300" },
        wood: { DEFAULT: "#8d5629", light: "#b47a45", dark: "#5e3a1a" },
        paper: { DEFAULT: "#f6ead0", dark: "#e8d5aa" },

        // Legacy tokens (used by the host dashboard)
        parchment: {
          light: "#fdf6e3",
          DEFAULT: "#f2e2ba",
          dark: "#dec58b",
          burnt: "#b38d4c",
          ink: "#1b1b1f",
        },
        crimson: { DEFAULT: "#e2312d", dark: "#b8211e" },
        gold: { DEFAULT: "#e9b300", bright: "#ffcc1f" },
        ocean: { deep: "#082f5a", mid: "#0d4a8a", foam: "#2f86cf" },
      },
      fontFamily: {
        display: ["'Luckiest Guy'", "Nunito", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
        baby: ["Nunito", "system-ui", "sans-serif"],
        wanted: ["'Playfair Display'", "'Times New Roman'", "serif"],
        poster: ["'Playfair Display'", "'Times New Roman'", "serif"],
      },
      boxShadow: {
        "ink-sm": "3px 3px 0 #1b1b1f",
        ink: "5px 5px 0 #1b1b1f",
        "ink-lg": "8px 8px 0 #1b1b1f",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        drift: "drift 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
