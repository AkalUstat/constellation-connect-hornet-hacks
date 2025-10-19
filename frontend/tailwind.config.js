/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ← make sure your React files are scanned
  ],
  theme: {
    extend: {
      colors: {
        // 🌠 Your custom cosmic palette
        space: {
          deep: "#00010A",
          surface: "#2B1E3D",
          gold: "#FACC15",
          coral: "#FB7185",
          magenta: "#E879F9",
          orange: "#F97316",
          white: "#F9FAFB",
        },
      },
      boxShadow: {
        // Soft radiant glows
        glow: "0 0 20px 4px rgba(249,115,22,0.5), 0 0 40px 8px rgba(232,121,249,0.4)",
        "glow-strong":
          "0 0 25px 6px rgba(249,115,22,0.6), 0 0 50px 10px rgba(232,121,249,0.5)",
      },
      backgroundImage: {
        // Gradient utilities for borders, panels, etc.
        "gradient-space":
          "linear-gradient(135deg, #F97316 0%, #E879F9 50%, #FACC15 100%)",
      },
      keyframes: {
        // ✨ Gentle glowing pulse animation
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        // 🌈 Shifting gradient motion (optional)
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        "gradient-shift":
          "gradient-shift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};