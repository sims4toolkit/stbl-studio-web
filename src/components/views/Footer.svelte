<script lang="ts">
  import { wompWompStore } from "src/lib/services/settings";
  import { fade } from "svelte/transition";

  let showWompWomp = false;

  function revealWompWomp(event: MouseEvent) {
    const btn = event.target as HTMLButtonElement;
    btn.remove();
    showWompWomp = true;
    wompWompStore.set(true);
  }
</script>

<footer
  class="relative w-full py-12 px-4 flex justify-center bg-gray-200 dark:bg-gray-900"
>
  <div class="w-full xl:max-w-screen-xl text-center flex flex-col gap-10">
    <div class="flex flex-col gap-4">
      <p>
        Created with <span class="text-pink-600">&#9829;</span> by Frankk using Sims
        4 Toolkit
      </p>
      <p>
        <a
          href="https://frankkmods.com"
          target="_blank"
          class="text-brand-frankk">Frankk's Mods</a
        >
        |
        <a
          href="https://sims4toolkit.com"
          target="_blank"
          class="text-accent-primary-light dark:text-accent-primary-dark"
          >Sims 4 Toolkit</a
        >
        |
        <a
          href="https://twitter.com/frankkulakmods"
          target="_blank"
          class="text-brand-twitter">Twitter</a
        >
        |
        <a
          href="https://patreon.frankkmods.com"
          target="_blank"
          class="text-brand-patreon">Patreon</a
        >
        |
        <a
          href="https://ko-fi.com/frankkulak"
          target="_blank"
          class="text-brand-kofi">Ko-fi</a
        >
        |
        <a
          href="https://discord.gg/qNhD3Jh"
          target="_blank"
          class="text-brand-discord">Discord</a
        >
      </p>
    </div>
    <div class="text-xs flex flex-col gap-4">
      <p class="text-subtle">
        The Sims™ and its plumbob icon are registered trademarks of Electronic
        Arts, Inc. (EA). Sims 4 Toolkit is not affiliated with or endorsed by
        EA.
      </p>
      <p class="text-subtle">
        All icons on this website are supplied by
        <a
          href="https://ionic.io/ionicons"
          target="_blank"
          class="text-secondary">Ionicons</a
        >
        and
        <a
          href="https://primer.github.io/octicons/"
          target="_blank"
          class="text-secondary">GitHub Octicons</a
        >.
      </p>
      <p class="text-subtle">2022 © Frank Kulak</p>
    </div>
  </div>
  <button
    class="absolute flex items-center justify-center bg-gray-200 dark:bg-gray-900 hacker-bg-black w-10 h-10 left-4 bottom-4"
    on:click={revealWompWomp}
    tabindex="-1"
  />
  {#if showWompWomp}
    <div
      in:fade
      class="absolute flex items-center justify-center w-10 h-10 left-4 bottom-4"
    >
      <img class="h-6" src="./assets/wompwomp.png" alt="Womp Womp" />
    </div>
  {/if}
</footer>
