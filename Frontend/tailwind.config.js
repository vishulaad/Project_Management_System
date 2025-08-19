/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ make sure all your components are included
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        typing: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 50%, 100%": { borderColor: "transparent" },
          "25%, 75%": { borderColor: "#1e3a8a" }, // blue-800
        },
      },
      animation: {
        slideIn: "slideIn 0.6s ease-out forwards",
        typing:
          "typing 3s steps(40, end) forwards, blink .75s step-end infinite",
      },
    },
  },
  plugins: [],
};
