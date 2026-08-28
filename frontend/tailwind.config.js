/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#6E1737',
          light: '#8A2447',
          dark: '#4E0F27',
        },
        saffron: {
          DEFAULT: '#E88932',
          light: '#F0A25C',
        },
        gold: {
          DEFAULT: '#D4A84F',
          light: '#E4C784',
          dark: '#B08A38',
        },
        rose: {
          DEFAULT: '#E9A6A9',
        },
        ivory: {
          DEFAULT: '#FFF7E8',
          dim: '#F6ECD6',
        },
        ink: {
          DEFAULT: '#3B241C',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        hand: ['"Kalam"', 'cursive'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 10px 40px -12px rgba(59, 36, 28, 0.35), 0 2px 8px rgba(59, 36, 28, 0.15)',
        glow: '0 0 24px rgba(212, 168, 79, 0.55)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1, transform: 'scaleY(1)' },
          '50%': { opacity: 0.85, transform: 'scaleY(0.96)' },
        },
        drift: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '100%': { transform: 'translateY(-120px) translateX(30px) rotate(45deg)', opacity: 0 },
        },
      },
      animation: {
        flicker: 'flicker 2.4s ease-in-out infinite',
        drift: 'drift 6s ease-in infinite',
      },
    },
  },
  plugins: [],
};
