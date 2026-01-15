/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'omg-green': '#022c22', // Monaco Racing Green
        'omg-cream': '#FFFDD0', // Rich Cream
        'omg-silver': '#C0C0C0', // Platinum Accent
        'omg-gold': '#D4AF37', // Classic Gold
        'omg-black': '#0a0a0a',
      },
      fontFamily: {
        sans: ['"Montserrat"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
