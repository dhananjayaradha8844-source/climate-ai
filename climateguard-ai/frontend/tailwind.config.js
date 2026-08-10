/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        climate: {
          blue: '#0EA5E9',
          green: '#10B981',
          red: '#EF4444',
          orange: '#F97316',
          dark: '#1E293B',
          light: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
