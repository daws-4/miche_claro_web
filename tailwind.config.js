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
        primarybackground: "#F4F4F4",
        secondarybackground: "#E0E0E0",
        primarytext: "#212121",
        accent1: "#4DB6AC",
        accent2: "#64B5F6",
        accentwarning: "#FFB74D",
        successtext: "#81C784",
        errortext: "#E57373",
        miche: {
          blue: "#003f63", // Azul oscuro del logo
          yellow: "#f9e27b", // Amarillo principal
          yellowLight: "#ffe168", // Hover amarillo
          green: "#285c3c", // Verde botella
          beige: "#f3f1e6", // Fondo claro
          tan: "#e3d9c6", // Fondo alterno
          text: "#403d39", // Texto secundario
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;