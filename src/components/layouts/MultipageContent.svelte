<script lang="ts">
  import type { MultipageContentState } from "./types";

  export let pageNumber: number;
  export let nextButtonText: string = "Next";
  export let state: MultipageContentState;

  let hidden = true;

  $: {
    hidden = pageNumber !== state.currentPage;
    onVisibilityChange();
  }

  function onVisibilityChange() {
    state.nextButtonText = nextButtonText;
    state.nextButtonEnabled = true;
  }
</script>

<div {hidden}>
  <slot />
</div>
