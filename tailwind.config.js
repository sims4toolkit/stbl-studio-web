module.exports = {
  content: ["./src/**/*.svelte", "./public/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#fefefe",
          75: "#f6f7f8",
          100: "#F4F4F6",
          200: "#ececf0",
          300: "#dcdfe4",
          400: "#9A9EA7",
          500: "#5f646d",
          600: "#474c56",
          675: "#3d424e",
          700: "#393E4A",
          800: "#2F3440",
          900: "#1F2227",
          950: "#191b1f",
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
