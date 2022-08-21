<script lang="ts">
  import Settings from "src/lib/services/settings";
  import HelpWindow from "src/components/windows/HelpWindow.svelte";
  import SettingsWindow from "src/components/windows/SettingsWindow.svelte";
  import HasherWindow from "../windows/HasherWindow.svelte";

  let showSettingsWindow = false;
  let showHelpWindow = false;
  let showHasherWindow = false;

  // redundant so icon can react without accessing settings
  let isLightTheme = Settings.isLightTheme;
  $: themeIcon = isLightTheme ? "sunny" : "moon";

  function toggleTheme() {
    if (Settings.mainframeHacked) return;
    Settings.isLightTheme = !Settings.isLightTheme;
    isLightTheme = Settings.isLightTheme;
  }
</script>

<nav
  class="fixed top-0 left-0 right-0 h-10 px-4 z-30 flex justify-between gap-4 bg-gray-200 dark:bg-gray-900 blurred-bg bottom-shadow"
>
  <a
    class="flex gap-2 items-center no-underline tint-on-hover whitespace-nowrap"
    href="/#"
  >
    <img src="./assets/s4tk-transparent.png" alt="S4TK" class="h-5" />
    <h2 class="font-bold">STBL Studio</h2>
  </a>
  <div class="flex gap-3 items-center">
    <a href="/#">
      <img
        src="./assets/home-outline.svg"
        alt="Home"
        class="svg tint-on-hover h-5"
      />
    </a>
    <button class="dropdown">
      <img
        src="./assets/construct-outline.svg"
        alt="Tools"
        class="svg tint-on-hover h-5"
      />
      <div class="dropdown-bridge" />
      <div
        class="dropdown-content drop-shadow-md rounded bg-gray-200 dark:bg-gray-900 hacker-border-gray hacker-bg-black"
      >
        <button
          class="py-1 w-full rounded-t hover:bg-gray-300 hover:dark:bg-gray-700 hover:hacker-bg-gray"
          on:click={() => (showHasherWindow = true)}>Hasher</button
        >
        <hr class="border-gray-300 dark:border-gray-800 hacker-border-gray" />
        <button class="py-1 w-full">Second</button>
        <button class="py-1 w-full rounded-b">Last</button>
      </div>
    </button>
    <button on:click={() => (showHelpWindow = !showHelpWindow)}>
      <img
        src="./assets/help-circle-outline.svg"
        alt="Help"
        class="svg tint-on-hover h-6"
      />
    </button>
    <button on:click={() => (showSettingsWindow = !showSettingsWindow)}>
      <img
        src="./assets/settings-outline.svg"
        alt="Settings"
        class="svg tint-on-hover h-5"
      />
    </button>
    <button on:click={toggleTheme}>
      <img
        src="./assets/{themeIcon}-outline.svg"
        alt="Settings"
        class="svg tint-on-hover h-5"
      />
    </button>
  </div>
</nav>

{#if showHelpWindow}
  <HelpWindow onClose={() => (showHelpWindow = false)} />
{/if}

{#if showSettingsWindow}
  <SettingsWindow onClose={() => (showSettingsWindow = false)} />
{/if}

{#if showHasherWindow}
  <HasherWindow onClose={() => (showHasherWindow = false)} />
{/if}

<style lang="scss">
  nav {
    overflow: visible !important;
  }

  .dropdown {
    position: relative;
    display: inline-block;

    .dropdown-bridge {
      position: absolute;
      top: 0;
      display: none;
      width: 42px;
      left: -10px;
      height: 2rem;
      width: 2rem;
      z-index: 40;
    }

    .dropdown-content {
      position: absolute;
      display: none;
      width: 160px;
      left: -69px;
      z-index: 40;
      top: 2rem;
    }

    &:hover,
    &:focus {
      .dropdown-content,
      .dropdown-bridge {
        display: block;
      }
    }
  }
</style>
