/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: ['"Karla"', "sans-serif"],
        kumbh: ['"Kumbh Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
}

