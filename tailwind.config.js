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
        brand: {
          frankk: "#8989fa",
          discord: "#7289da",
          kofi: "#fbaa19",
          patreon: "#f96854",
          twitter: "#1da1f2",
        },
        accent: {
          primary: {
            light: "#18ac87",
            dark: "#70cfb6",
          },
          secondary: {
            light: "#0095eb",
            dark: "#49c6e6",
          },
        },
      },
    },
  },
  plugins: [],
};
