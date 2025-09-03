/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        white:"#ffffff",
        black:{
          light:"#262626",
          faded:"#00000059"
        },
        blue:{
          medium:"#005c98",
        },
        gray:{
          base:"#616161",
          background:"#fafafa",
          primary:"#dbdbdb"
        },
        red:{
          primary:"#ed4956"
        },
      },
    },
  },
  plugins: [],
}