module.exports = {
  content: ["./src/**/*.svelte", "./public/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#FAFAFB",
          100: "#F4F4F6",
          200: "#E6E7EB",
          300: "#D2D5DB",
          400: "#9A9EA7",
          500: "#666A74",
          600: "#4D515A",
          700: "#393E4A",
          800: "#2F3440",
          900: "#1F2227",
        },
      },
    },
  },
  plugins: [],
};
