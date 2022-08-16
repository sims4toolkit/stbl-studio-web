<script lang="ts">
  import type { MultipageContentState } from "./types";

  export let pageNumber: number;
  export let state: MultipageContentState;

  $: visible = pageNumber === state.currentPage;
</script>

{#if visible}
  <slot />
{/if}
