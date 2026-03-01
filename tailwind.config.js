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
          primary: '#FF8A3D', // Warm Orange
          secondary: '#FFC56A', // Gold
          accent: '#0F7B65', // Deep Green
          sage: '#7FAF9C', // Muted Sage
          dark: '#1F1F1F', // Dark Charcoal
          gray: '#6B6B6B', // Soft Gray
          bg: '#F4F1EC', // Soft Warm Gray
          surface: '#FFFFFF', // White
        }
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'clay': 'inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.05), 0 10px 30px rgba(0, 0, 0, 0.08)',
        'clay-hover': 'inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.05), 0 15px 40px rgba(0, 0, 0, 0.12)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF8A3D 0%, #FFC56A 100%)',
        'gradient-clay': 'linear-gradient(145deg, #ffffff, #f0f0f0)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'text-shimmer': 'shimmer 8s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scroll': 'scroll 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
