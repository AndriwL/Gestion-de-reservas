/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0E1A',
          900: '#0F1524',
          800: '#151C2E',
          700: '#1E273C',
          600: '#2B3550',
        },
        teal: {
          50: '#EEFBF9',
          400: '#22D3C4',
          500: '#14B8A6',
          600: '#0D9488',
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
        panel: '0 1px 2px rgba(10, 14, 26, 0.06), 0 8px 24px rgba(10, 14, 26, 0.06)',
      },
    },
  },
  plugins: [],
}
