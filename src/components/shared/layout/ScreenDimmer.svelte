<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";

  const bodyClassName = "overlay-active";

  onMount(() => {
    document.body.classList.add(bodyClassName);
  });

  onDestroy(() => {
    document.body.classList.remove(bodyClassName);
  });
</script>

<div transition:fade class="screen-dimmer">
  <slot />
</div>

<style lang="scss">
  .screen-dimmer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1024;
    background-color: var(--color-dimmer);
  }
</style>
