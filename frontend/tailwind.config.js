/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          400: '#D9814A',
          500: '#C8622A',
          600: '#A34E20',
        },
        emerald: {
          400: '#2E5E4E',
          500: '#1F4035',
        },
        red: {
          400: '#B23A2E',
          500: '#96301F',
        },
        amber: {
          400: '#B8863B',
          500: '#96702E',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        rise: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        rise: 'rise 0.45s ease both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
