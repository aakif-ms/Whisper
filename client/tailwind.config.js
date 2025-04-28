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
      },
      colors: {
        lightPurple: '#8d96ee',
        lightPink: '#fff7fe'
      },
    },
    screens: {
      md: "850px",
      lg: "1500px",
    },
  },
  plugins: [require('daisyui')],
}