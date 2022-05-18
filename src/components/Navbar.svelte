<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import ThemeToggler from "./ThemeToggler.svelte";
</script>

<nav class="flex-center-v flex-space-between bottom-shadow bg-blur">
  <div class="left flex-center-v flex-space-between">
    <a href="/" use:link class="flex-center-v flex-space-between">
      <img src="../assets/s4tk-transparent.png" alt="Sims 4 Toolkit Icon" />
      <h3 class="m-0">Sims 4 Toolkit</h3>
    </a>
  </div>
  <div class="right flex-center-v flex-space-between">
    <a href="/docs" use:link class:active={$location === "/docs"}>Docs</a>
    <a href="/help" use:link class:active={$location === "/help"}>Help</a>
    <a href="https://github.com/sims4toolkit" target="_blank">GitHub</a>
    <a href="https://npmjs.com/org/s4tk" target="_blank">npm</a>
    <ThemeToggler />
  </div>
</nav>

<style lang="scss">
  $navbar-height: 50px;

  nav {
    background-color: var(--color-navbar);
    padding: 0 1em;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: $navbar-height;
    overflow-x: auto;
    z-index: 1024;
    white-space: nowrap;

    div.left {
      margin-right: 2em;

      img {
        width: auto;
        height: 1.5em;
        margin-right: 1em;
      }
    }

    a {
      color: var(--color-text);
      text-decoration: none;

      &:not(:last-child) {
        margin-right: 1em;
      }

      &:hover:not(.active) {
        opacity: 0.65;
      }

      &.active {
        font-weight: bold;
        pointer-events: none;
      }
    }
  }

  :global(.below-navbar) {
    margin-top: $navbar-height;
  }
</style>
