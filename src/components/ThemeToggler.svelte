<script lang="ts">
  import { onMount } from "svelte";
  import StorageService from "../services/storage";

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
