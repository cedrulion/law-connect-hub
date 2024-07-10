/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        Arial: ['Arial', 'sans-serif'],
        Ubuntu: ['Ubuntu', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
        Roboto: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
