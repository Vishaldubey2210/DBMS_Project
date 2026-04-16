// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // required for manual dark mode toggle
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a", // green-600
          light: "#22c55e",
          dark: "#15803d",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
