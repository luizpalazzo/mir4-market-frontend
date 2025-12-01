/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          card: '#1a1a2e',
          border: '#2a2a3e',
          text: '#e0e0e0',
          textMuted: '#a0a0a0',
        }
      }
    },
  },
  plugins: [],
}

