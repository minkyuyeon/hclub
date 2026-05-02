import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f6f2e8",
        night: "#07070a",
        panel: "#111119",
        gold: "#d7b35c",
        rose: "#ff3d7f"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        accent: ["var(--font-accent)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
