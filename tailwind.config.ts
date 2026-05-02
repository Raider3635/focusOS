import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0f0f0f',
        surface: '#141414',
        raised:  '#1c1c1c',
        hover:   '#252525',
        border:  '#2a2a2a',
        muted:   '#555555',
        dim:     '#888888',
        text:    '#f0f0f0',
        accent:  '#6366f1',
        green:   '#22c55e',
        yellow:  '#eab308',
        red:     '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-out',
        'slide-up':   'slideUp 0.2s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                     to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
export default config
