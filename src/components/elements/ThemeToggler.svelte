<script lang="ts">
  import { onMount } from "svelte";
  import StorageService from "../../typescript/storage-service";

  let isLightTheme: boolean = true;

  $: themeImgSrc = `../assets/${isLightTheme ? "sunny" : "moon"}-outline.svg`;
  $: themeImgAlt = `${isLightTheme ? "Light" : "Dark"} Theme`;

  function toggleTheme() {
    isLightTheme = !isLightTheme;
    setTheme();
    StorageService.settings.isLightTheme = isLightTheme;
  }

  function setTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      isLightTheme ? "light" : "dark"
    );
  }

  onMount(() => {
    isLightTheme = StorageService.settings.isLightTheme;
    setTheme();
  });
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
  }
</style>
