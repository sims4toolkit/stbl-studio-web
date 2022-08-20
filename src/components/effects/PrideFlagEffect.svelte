<script lang="ts">
  import { fade } from "svelte/transition";
</script>

<div
  transition:fade={{ duration: 350 }}
  class="fixed top-0 right-0 bottom-0 left-0 z-50 opacity-5 pointer-events-none"
/>

<style lang="scss">
  div {
    background-image: linear-gradient(
      120deg,
      red 0%,
      orange 20%,
      yellow 40%,
      lime 60%,
      blue 80%,
      purple 100%
    );
  }
</style>
