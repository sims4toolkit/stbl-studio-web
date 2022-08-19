<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import Settings from "src/lib/services/settings";

  const bodyClassName = "overlay-active";

  onMount(() => {
    document.body.classList.add(bodyClassName);
  });

  onDestroy(() => {
    document.body.classList.remove(bodyClassName);
  });
</script>

<div
  transition:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
  class="fixed top-0 right-0 bottom-0 left-0 z-40 bg-gray-400 bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60"
>
  <slot />
</div>
