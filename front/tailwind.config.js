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
        'glow': '0 0 20px rgba(25, 85, 255, 0.3)',
        'glow-gold': '0 0 20px rgba(250, 204, 21, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
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
        },
        gamify: {
          gold: '#faca15',
          silver: '#e5e7eb',
          bronze: '#d97706',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      }
    },
  },
  plugins: [],
}
