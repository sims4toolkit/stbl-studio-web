<script lang="ts">
  import { replace } from "svelte-spa-router";

  export let name: string;
  export let description: string;
  export let link: string;

  function goToLink() {
    replace("/tools/" + link);
  }
</script>

<button class="button-wrapper" on:click={goToLink}>
  <div class="floating-card drop-shadow move-on-hover text-left">
    <h3 class="nowrap-truncate mt-0 mb-1">
      {name}
    </h3>
    <p class="my-0">
      {description}
    </p>
  </div>
</button>

<style lang="scss">
  // intentionally blank
</style>
