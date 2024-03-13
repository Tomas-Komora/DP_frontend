module.exports = {
  content: [
      "./pages/**/*.{ts,tsx,js,html}",
      "./components/**/*.{ts,tsx, html, js}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f7fafc', // Used for border
          200: '#edf2f7', // Used for background
          400: '#cbd5e0', // Used for icons
          500: '#a0aec0', // Used for secondary text
          700: '#4a5568', // Used for less emphasized text
          900: '#1a202c', // Used for primary text
        },
        indigo: {
          600: '#5a67d8', // Hover state for links
          500: '#667eea', // Default state for links
        },
        blue: {
          // Define specific blue if used, or reuse indigo if it's close enough
        },
      },
    },
  },
}
