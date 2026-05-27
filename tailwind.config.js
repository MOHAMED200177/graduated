/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0D0A12",
        primary: "#C2185B",
        accent: "#F8BBD9",
        teal: "#4DD0C4",
        gold: "#C9A84C",
        glass: "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        cormorant: ["Cormorant Garamond", "serif"],
        dm: ["DM Sans", "sans-serif"],
        naskh: ["Noto Naskh Arabic", "serif"],
        cairo: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
