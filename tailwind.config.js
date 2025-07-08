import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        verde1: "#1F6527",
        verde2: "#58A168",
        verde3: "#114519",
        azul1: "#2A7CA1",
        azul2: "#174A64",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;