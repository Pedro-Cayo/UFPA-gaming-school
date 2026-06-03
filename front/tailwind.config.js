/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ufpa: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c1d3ff',
          300: '#a2bdff',
          400: '#8ba8ff',
          500: '#6b92ff',
          600: '#4b7cff',
          700: '#3b6be8',
          800: '#2b5ad1',
          900: '#1b49ba',
        }
      }
    },
  },
  plugins: [],
}
