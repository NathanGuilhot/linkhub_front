/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-green-500','hover:bg-green-400',
    'bg-blue-500','hover:bg-blue-400',
    'bg-pink-500','hover:bg-pink-400',
    'bg-purple-500','hover:bg-purple-400',
    'bg-red-500','hover:bg-red-400',
  ],
}

