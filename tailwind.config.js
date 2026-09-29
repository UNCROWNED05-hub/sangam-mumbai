/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14163A',
          soft: 'rgba(20, 22, 58, 0.72)',
          muted: 'rgba(20, 22, 58, 0.45)',
        },
        marigold: {
          DEFAULT: '#FFC21A',
          hover: '#E5AC15',
          light: '#FFEAA0',
        },
        bougainvillea: {
          DEFAULT: '#FF3D7F',
          hover: '#E82A6A',
          light: '#FF70A2',
        },
        lagoon: {
          DEFAULT: '#10B5A5',
          hover: '#0E9D8F',
          light: '#42D8C9',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8F9FD',
        },
        night: {
          DEFAULT: '#1D2050',
          dark: '#0B0E2A',
          card: '#242861',
        },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        emoji: ['"Noto Color Emoji"', 'sans-serif'],
      },
      borderRadius: {
        'sheet': '28px',
        'phone': '44px',
      },
      transitionTimingFunction: {
        'natural': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      boxShadow: {
        'soft': '0 10px 24px -4px var(--shadow-tint, rgba(20, 22, 58, 0.08))',
        'ambient': '0 40px 80px -12px var(--shadow-tint, rgba(20, 22, 58, 0.12))',
        'pill': '0 4px 14px -2px rgba(20, 22, 58, 0.12)',
        'marigold-glow': '0 0 30px -4px rgba(255, 194, 26, 0.45)',
      }
    },
  },
  plugins: [],
}
