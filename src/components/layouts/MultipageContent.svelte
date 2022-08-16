<script lang="ts">
  import type { MultipageContentState } from "./types";

  export let pageNumber: number;
  export let nextButtonText: string = "Next";
  export let state: MultipageContentState;

  let visible = false;

  $: {
    visible = pageNumber === state.currentPage;
    onVisibilityChange();
  }

  function onVisibilityChange() {
    state.nextButtonText = nextButtonText;
    state.nextButtonEnabled = true;
  }
</script>

{#if visible}
  <slot />
{/if}
