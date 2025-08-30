/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Georgia', 'Times New Roman', 'serif'],
        'body': ['Palatino', 'Book Antiqua', 'serif'],
        'mono': ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} 