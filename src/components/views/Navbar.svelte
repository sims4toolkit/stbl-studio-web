<script lang="ts">
  import Settings from "src/lib/services/settings";

  // redundant so icon can react without accessing settings
  let isLightTheme = Settings.isLightTheme;
  $: themeIcon = isLightTheme ? "sunny" : "moon";

  function toggleTheme() {
    Settings.isLightTheme = !Settings.isLightTheme;
    isLightTheme = Settings.isLightTheme;
  }
</script>

<nav
  class="fixed top-0 left-0 right-0 h-10 px-4 flex justify-between bg-gray-200 dark:bg-gray-900 blurred-bg bottom-shadow"
>
  <a class="flex gap-2 items-center no-underline tint-on-hover" href="/">
    <img src="./assets/s4tk-transparent.png" alt="S4TK" class="h-5" />
    <h2 class="font-bold">STBL Studio</h2>
  </a>
  <div class="flex gap-3 items-center">
    <a href="/">
      <img
        src="./assets/home-outline.svg"
        alt="Home"
        class="svg tint-on-hover h-5"
      />
    </a>
    <a href="/">
      <img
        src="./assets/construct-outline.svg"
        alt="Tools"
        class="svg tint-on-hover h-5"
      />
    </a>
    <a href="/">
      <img
        src="./assets/help-circle-outline.svg"
        alt="Help"
        class="svg tint-on-hover h-6"
      />
    </a>
    <a href="/">
      <img
        src="./assets/settings-outline.svg"
        alt="Settings"
        class="svg tint-on-hover h-5"
      />
    </a>
    <button on:click={toggleTheme}>
      <img
        src="./assets/{themeIcon}-outline.svg"
        alt="Settings"
        class="svg tint-on-hover h-5"
      />
    </button>
  </div>
</nav>