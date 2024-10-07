/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [function ({ addUtilities }) {
    const newUtilities = {
      /* Hide scrollbar for WebKit browsers */
      '.no-scrollbar::-webkit-scrollbar': {
        display: 'none',
      },
      /* Hide scrollbar for IE, Edge, and Firefox */
      '.no-scrollbar': {
        '-ms-overflow-style': 'none', /* IE and Edge */
        'scrollbar-width': 'none', /* Firefox */
      },
    }
    addUtilities(newUtilities)
  },],
}