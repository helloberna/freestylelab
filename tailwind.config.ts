// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#4DFFF5',
          purple: '#9B4DFF',
          red: '#FF4D4D',
          blue: '#4DACFF',
          pink: '#FF1A75',
        },
        background: '#0F0F17',
        surface: '#1A1A2E',
        text: {
          primary: '#FFFFFF',
          secondary: '#9B9BB2',
          accent: '#4DFFF5',
        }
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config