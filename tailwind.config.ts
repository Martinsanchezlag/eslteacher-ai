import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B56EB",
        "primary-dark": "#112C70",
        "primary-hover": "#4a45d4",
        accent: "#BB63FF",
        cyan: "#56E1E9",
        navy: "#0A2353",
        "card-bg": "#ffffff",
        "page-bg": "#f5f6fa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
        "card-hover": "0 6px 24px rgba(91,86,235,0.13)",
        modal: "0 20px 60px rgba(0,0,0,0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
