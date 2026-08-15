/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#07070f',
          900: '#0b0b18',
          800: '#12122200',
        },
        accent: {
          400: '#5b8def',
          500: '#3b6fe0',
          600: '#2d54c8',
          glow: 'rgba(59,111,224,0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(59,111,224,0.35)',
        'glow-sm': '0 0 12px rgba(59,111,224,0.28)',
      },
      borderRadius: {
        xl2: '20px',
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
        pulseglow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(59,111,224,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59,111,224,0.35)' },
        },
      },
      animation: {
        rise: 'rise 0.45s ease both',
        shimmer: 'shimmer 1.6s infinite',
        pulseglow: 'pulseglow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
