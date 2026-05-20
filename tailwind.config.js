/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Tambahin ini kalau kamu pakai folder src
  ],
  theme: {
    extend: {
       keyframes: {
      "marquee-left": {
        "0%":   { transform: "translateX(0)" },
        "100%": { transform: "translateX(-33.333%)" },
      },
      "marquee-right": {
        "0%":   { transform: "translateX(-33.333%)" },
        "100%": { transform: "translateX(0)" },
      },
    },
    animation: {
      "marquee-left":  "marquee-left var(--marquee-duration, 30s) linear infinite",
      "marquee-right": "marquee-right var(--marquee-duration, 30s) linear infinite",
    },
    },
  },
  plugins: [],
}