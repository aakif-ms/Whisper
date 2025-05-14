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
        lightPink: '#fff7fe',
        paleBlue: "#457b9d",
        lightBlue: "#a8dadc",
        cream: "#f1faee",
        darkBlue: "#1d3557",
      },
    },
    screens: {
      md: "850px",
      lg: "1500px",
    },
  },
  plugins: [require('daisyui')],
}