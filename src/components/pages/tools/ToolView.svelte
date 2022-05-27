<script lang="ts">
  import { replace } from "svelte-spa-router";
  import SectionHeader from "../../shared/elements/SectionHeader.svelte";

  export let name: string;
  export let description: string;
  export let link: string;

  function goToLink() {
    replace("/tools/" + link);
  }
</script>

<button class="button-wrapper" on:click={goToLink}>
  <div class="floating-card drop-shadow move-on-hover text-left h-100">
    <div class="mb-1">
      <SectionHeader title={name} />
    </div>
    <p class="my-0">
      {description}
    </p>
  </div>
</button>

<style lang="scss">
  // intentionally blank
</style>
