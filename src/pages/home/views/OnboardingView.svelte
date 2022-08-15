<script lang="ts">
  import { fly } from "svelte/transition";
  import Settings from "src/lib/services/settings";

  const flyDistance = 15;
  const flyDuration = Settings.reduceMotion ? 0 : 500;
</script>

<div class="flex flex-col gap-8">
  <div transition:fly={{ y: -flyDistance, duration: flyDuration }}>
    <p>Welcome to</p>
    <h2 class="font-bold text-2xl mb-2 text-gradient drop-shadow">
      String Table Studio
    </h2>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Powered by <a
        class="text-secondary"
        href="https://sims4toolkit.com"
        target="_blank">Sims 4 Toolkit</a
      >
    </p>
  </div>
  <div
    class="flex flex-col gap-4"
    transition:fly={{ y: flyDistance, duration: flyDuration }}
  >
    <p>
      String Table Studio is a web app that makes it easy to create, edit, and
      translate string tables for Sims 4 mods. View the <a
        class="text-secondary"
        href="/"
        target="_blank">feature list</a
      > to learn more about what it can do.
    </p>
    <p>TODO</p>
  </div>
</div>
