<script lang="ts">
  import { onMount } from "svelte";
  import StorageService from "../services/storage";

  let isDarkTheme: boolean = true;

  $: themeImgSrc = `../assets/${isDarkTheme ? "moon" : "sunny"}-outline.svg`;
  $: themeImgAlt = `${isDarkTheme ? "Dark" : "Light"} Theme`;

  function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    setTheme();
    StorageService.settings.isDarkTheme = isDarkTheme;
  }

  function setTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkTheme ? "dark" : "light"
    );
  }

  onMount(() => {
    isDarkTheme = StorageService.settings.isDarkTheme;
    setTheme();
  });
</script>

<img
  src={themeImgSrc}
  alt={themeImgAlt}
  class="is-svg theme-toggle hoverable"
  on:click={toggleTheme}
  title="Toggle Theme"
/>

<style lang="scss">
  img.theme-toggle {
    height: 1.25em;
    width: auto;
  }
</style>
