module.exports = {
  content: [
      "./pages/**/*.{ts,tsx,js,html}",
      "./components/**/*.{ts,tsx, html, js}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#E6E6F0", // O2 indigo 10% opacity on white
          100: "#CCCCE0", // O2 indigo 20%
          200: "#B3B3D2", // O2 indigo 30%
          300: "#9999C2", // O2 indigo ...
          400: "#8080B3", // O2 indigo
          500: "#6666A3", // O2 indigo
          600: "#4D4D94", // O2 indigo
          700: "#333385", // O2 indigo
          800: "#1A1A76", // O2 indigo
          900: "#000066", // O2 indigo
        },
        teal: {
          600: "#01B7B4",
        },
        sky: {
          50: "#E6F5FB", // Primary 10% opacity on white
          100: "#CCE9F7", // Primary 20%
          200: "#99D4EE", // Primary 40%
          300: "#66BEE6", // Primary 60%
          400: "#33A9DD", // Primary 80%
          500: "#0093d5", // Primary
          700: "#0666A2", // Taken from mobile app
          900: "#0a0d37", // Taken from O2 gradient
        },
        tesco: "#128BDC",
      },
    },
  },
}
