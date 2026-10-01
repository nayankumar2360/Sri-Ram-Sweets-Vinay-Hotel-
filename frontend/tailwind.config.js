/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9B2335',
          dark: '#7A1B29',
        },
        secondary: {
          DEFAULT: '#D4A017',
          light: '#F0D060',
        },
        accent: '#E8742A',
        cream: {
          DEFAULT: '#FFF9F0',
        },
        surface: '#FFFFFF',
        text: {
          primary: '#2C1810',
          secondary: '#6B4F3A',
          light: '#9B8579',
        },
        success: '#15803D',
        error: '#DC2626',
        warning: '#F59E0B',
        border: '#E8DDD4',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
