<script lang="ts">
  import StorageService from "../../typescript/storage-service";
  import { isLightThemeStore } from "../../typescript/stores";

  let isLightTheme = StorageService.settings.isLightTheme;
  isLightThemeStore.subscribe((value) => {
    isLightTheme = value;
  });

  $: themeImgSrc = `../assets/${isLightTheme ? "sunny" : "moon"}-outline.svg`;
  $: themeImgAlt = `${isLightTheme ? "Light" : "Dark"} Theme`;

  function toggleTheme() {
    isLightTheme = !isLightTheme;
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
    height: 1.25em;
    width: 1.25em;

    img {
      height: 100%;
      width: auto;
    }

    &:hover {
      opacity: 0.65;
    }
  }
</style>
