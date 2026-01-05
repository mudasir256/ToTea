/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faf7',
          100: '#d4f0e5',
          200: '#b8e6d3',
          300: '#9cdcc1',
          400: '#98d8b9', // Logo pastel green
          500: '#7cc8a5',
          600: '#60b891',
          700: '#4a9d7a',
          800: '#3a7d60',
          900: '#2a5d46',
        },
        tea: {
          light: '#d4f0e5',
          medium: '#98d8b9',
          dark: '#7cc8a5',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

