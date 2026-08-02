/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B2430",
        paper: "#FAF6EF",
        marigold: {
          DEFAULT: "#E8A33D",
          dark: "#C97F1F"
        },
        clay: {
          DEFAULT: "#C4592C",
          dark: "#9E4420"
        },
        teal: {
          DEFAULT: "#2F6F62",
          dark: "#204E44"
        },
        line: "#DDD3C0"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      },
      borderRadius: {
        stall: "2px"
      },
      boxShadow: {
        plaque: "3px 3px 0 0 rgba(27,36,48,0.9)",
        "plaque-sm": "2px 2px 0 0 rgba(27,36,48,0.9)"
      }
    }
  },
  plugins: []
};
