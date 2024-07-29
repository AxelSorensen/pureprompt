/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      keyframes: {
        left: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        }
      },
      animation: {
        wiggle: "wiggle .3s ease-in-out forwards"
      }
    },
  },
  plugins: [],
}

