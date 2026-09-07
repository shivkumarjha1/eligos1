/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        eligos: {
          blue: "#1A6FD4",
          blueHover: "#1459AA",
          dark: "#0F172A",
          light: "#F8FAFC",
          green: "#0D8C6E",
          red: "#DC2626",
          amber: "#D97706",
          border: "#E2E8F0",
          card: "#FFFFFF",
          muted: "#64748B"
        }
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "sans-serif"]
      }
    },
  },
  plugins: [],
};
