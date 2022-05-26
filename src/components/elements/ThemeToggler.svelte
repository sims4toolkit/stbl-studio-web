<script lang="ts">
  import { Settings } from "../../typescript/storage";
  import { isLightThemeStore } from "../../typescript/stores";

  let isLightTheme = Settings.isLightTheme;
  isLightThemeStore.subscribe((value) => {
    isLightTheme = value;
  });

  $: themeImgSrc = `../assets/${isLightTheme ? "sunny" : "moon"}-outline.svg`;
  $: themeImgAlt = `${isLightTheme ? "Light" : "Dark"} Theme`;

  function toggleTheme() {
    isLightTheme = !isLightTheme;

    if (!Settings.reduceMotion) {
      document.documentElement.classList.add("theme-transition");
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 500); // keep in sync with theme-transition class in base.scss
    }

    isLightThemeStore.set(isLightTheme);
  }
</script>

<button on:click={toggleTheme} class="button-wrapper">
  <img
    src={themeImgSrc}
    alt={themeImgAlt}
    class="is-svg"
    title="Toggle Theme"
  />
</button>

<style lang="scss">
  button {
    height: 20px;
    width: 20px;

    img {
      height: 100%;
      width: auto;
    }

    &:hover {
      opacity: 0.65;
    }
  }
</style>
