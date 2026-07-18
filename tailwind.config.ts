import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./app/**/*.{ts,tsx,js,jsx,css}",
    "./routes/**/*.{ts,tsx,js,jsx,css}",
    "./welcome/**/*.{ts,tsx,js,jsx,css}",
    "./public/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "sans-serif",
          "system-ui",
          "ui-sans-serif",
          "Helvetica Neue",
          "Arial",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
