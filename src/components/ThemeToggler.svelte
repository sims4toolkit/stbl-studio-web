<script lang="ts">
  import { onMount } from "svelte";

  let isDarkTheme: boolean = true;

  $: themeImgSrc = `../assets/${isDarkTheme ? "moon" : "sunny"}-outline.svg`;
  $: themeImgAlt = `${isDarkTheme ? "Dark" : "Light"} Theme`;

  function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    setTheme();
    localStorage.setItem("isDarkTheme", isDarkTheme.toString());
  }

  function setTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkTheme ? "dark" : "light"
    );
  }

  onMount(() => {
    const isDarkThemeStr = localStorage.getItem("isDarkTheme");
    isDarkTheme = !isDarkThemeStr || isDarkThemeStr === "true";
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
