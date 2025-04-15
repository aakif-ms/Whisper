/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        national: ["National Park", "sans-serif"],
        poetsen: ["Poetsen One", "sans-serif"]
      }
    },
    screens: {
      md: "850px",
      lg: "1500px",
    },
  },
  plugins: [],
}