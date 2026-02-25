/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          obsidian: '#0B0F19',
          dark: '#0B0F19',
          primary: '#7C3AED',
          accent: '#7C3AED',
          signal: '#7C3AED'
        }
      },
      boxShadow: {
        'premium': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)',
        'premium-dark': '0 0 0 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.4)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
      },
      animation: {
        'mesh': 'mesh 20s ease infinite',
        'scanline': 'scanline 10s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        mesh: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(5%, -5%) scale(1.05)' },
          '66%': { transform: 'translate(-5%, 5%) scale(0.95)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}
