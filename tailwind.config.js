/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101B33',
          50: '#EEF1F7',
          100: '#D6DCEB',
          200: '#AEB9D6',
          300: '#7E8FB8',
          400: '#54658F',
          500: '#374568',
          600: '#26314F',
          700: '#1A2440',
          800: '#101B33',
          900: '#0A1226',
          950: '#060B18',
        },
        paper: '#F6F7FA',
        amber: {
          DEFAULT: '#E8A33D',
          light: '#FBEBD2',
        },
        teal: {
          DEFAULT: '#28897A',
          light: '#DDF0EB',
        },
        coral: {
          DEFAULT: '#DE5B4C',
          light: '#FBE3DF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'route-dash': 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 14px)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 27, 51, 0.06), 0 1px 12px rgba(16, 27, 51, 0.05)',
      },
    },
  },
  plugins: [],
}
