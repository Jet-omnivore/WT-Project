/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D7377',
        secondary: '#14A085',
        background: '#F0F8FF',
        success: '#27AE60',
        warning: '#F39C12',
        danger: '#E74C3C',
        darkblue: '#1A3C5E',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
