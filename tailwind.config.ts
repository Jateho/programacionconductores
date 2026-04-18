import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dceeff',
          200: '#b8dcff',
          300: '#8ac0ff',
          400: '#5699ff',
          500: '#2d79f6',
          600: '#205ddb',
          700: '#1d4aaf',
          800: '#1d3c8b',
          900: '#1e2d6b'
        }
      }
    }
  },
  plugins: [],
};

export default config;
