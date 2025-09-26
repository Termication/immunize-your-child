/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#123456",
        secondary: "#040720",
        accent: "#DBE9FA",
        neutral: "#F5F5F5",
        "neutral-content": "#1A1A1A",
        "neutral-content-inverse": "#FFFFFF",
        "neutral-content-inverse-inverse": "#1A1A1A",
        "neutral-content-inverse-inverse-inverse": "#FFFFFF",
        "neutral-content-inverse-inverse-inverse-inverse": "#1A1A1A",
      },
    },
  },
  plugins: [],
}
