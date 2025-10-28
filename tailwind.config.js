/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/index.html", "./app/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5A39F4",
          foreground: "#0B0415",
          muted: "#968BF7",
          50: "#F1EEFF",
          100: "#DCD6FF",
          200: "#B1A9FF",
          300: "#877CFE",
          400: "#6959F9",
          500: "#5A39F4",
          600: "#4E2DD3",
          700: "#3B22A0",
          800: "#28166D",
          900: "#150A3A"
        },
        surface: {
          DEFAULT: "#0F0A1F",
          muted: "#1A1333",
          subtle: "#2A1D4A",
          border: "#31265C"
        },
        success: "#3AD59A",
        warning: "#F6B73C",
        danger: "#FF5C5C"
      },
      borderRadius: {
        xl: "1.5rem",
        lg: "1rem",
        md: "0.75rem"
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(90, 57, 244, 0.45)",
        card: "0 20px 45px rgba(12, 9, 25, 0.35)"
      },
      animation: {
        "slow-spin": "spin 18s linear infinite",
        "fade-in": "fade-in 300ms ease-out forwards"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
