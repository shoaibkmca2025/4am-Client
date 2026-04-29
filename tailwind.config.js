/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          primary: '#FFFFFF',
          secondary: '#FFFFFF',
          accent: '#FFFFFF',
          dark: '#000000',
          gray: '#666666',
          bg: '#000000',
          surface: '#111111',
          muted: '#999999',
        }
      },
      boxShadow: {
        'soft': '0 8px 20px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scroll': 'scroll 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
