/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.45)',
        soft: '0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'panel-in': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'panel-in': 'panel-in 0.28s ease-out both',
      },
    },
  },
  plugins: [],
}
