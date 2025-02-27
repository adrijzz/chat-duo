/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'swipe-right': 'swipe-right 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards'
      },
      keyframes: {
        'swipe-right': {
          '0%': { transform: 'translateX(0)', opacity: '0.4' },
          '50%': { transform: 'translateX(8px)', opacity: '0.8' },
          '100%': { transform: 'translateX(0)', opacity: '0.4' }
        },
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
    },
  },
  plugins: [],
};