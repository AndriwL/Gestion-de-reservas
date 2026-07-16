/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0E2530',
          900: '#12313D',
          800: '#164250',
          700: '#205464',
          600: '#396675',
        },
        teal: {
          50: '#E8FBFC',
          400: '#29D4D4',
          500: '#17D8D3',
          600: '#0C9EA5',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 2px 6px rgba(14, 37, 48, 0.04), 0 14px 30px rgba(14, 37, 48, 0.08)',
      },
    },
  },
  plugins: [],
}
