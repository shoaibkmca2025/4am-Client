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
      // shadcn/ui tokens used by components/ui/* (mapped to the dark theme)
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.08)',
      },
      colors: {
        card: {
          DEFAULT: '#0A0A0A',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1A1A1A',
          foreground: 'rgba(255, 255, 255, 0.5)',
        },
        brand: {
          primary: '#FF6A3D',   // electric orange — energy / marketing
          secondary: '#FFC56A', // warm gold
          accent: '#8B5CF6',    // violet — technology / engineering
          cyan: '#22D3EE',      // cyan — data / analytics
          lime: '#A3E635',      // lime — growth / success states
          dark: '#050505',
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
        },
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scroll': 'scroll 1.5s ease-in-out infinite',
        'spotlight': 'spotlight 2s ease 0.75s 1 forwards',
      },
    },
  },
  plugins: [],
}
