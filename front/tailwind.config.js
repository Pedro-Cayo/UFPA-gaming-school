/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
    boxShadow: {
    'premium': '0 20px 50px rgba(0, 0, 0, 0.15)',
    'card': '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  backdropBlur: {
    'xs': '2px',
  },
  animation: {
    'fade-in-up': 'fadeInUp 0.6s ease-out',
    'slide-in-left': 'slideInLeft 0.6s ease-out',
  },  
      colors: {
        ufpa: {
  50: '#e8eeff',
  100: '#d1ddff',
  200: '#a3bbff',
  300: '#7599ff',
  400: '#4777ff',
  500: '#1955ff',
  600: '#0d3dd4',
  700: '#0a2fa8',
  800: '#07217c',
  900: '#051350',
}
      }
    },
  },
  plugins: [],
}
