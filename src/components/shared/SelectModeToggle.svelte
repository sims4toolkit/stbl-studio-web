<script lang="ts">
  import type { Selectable } from "../../global";

  export let selectMode: boolean;
  export let selectables: Selectable[];

  function selectAll() {
    selectables.forEach((s) => {
      s.selected = true;
    });
  }

  function deselectAll() {
    selectables.forEach((s) => {
      s.selected = false;
    });
  }
</script>

<div class="flex-center-h">
  {#if selectMode}
    <button class="select-toggle" on:click={selectAll}>select all</button>
    <button class="select-toggle" on:click={deselectAll}>deselect all</button>
  {/if}
  <button
    class="select-toggle"
    class:large-font={selectMode}
    on:click={() => (selectMode = !selectMode)}
  >
    {#if selectMode}
      &times;
    {:else}
      select
    {/if}
  </button>
</div>

<style lang="scss">
  .select-toggle {
    border: none;
    background: none;
    color: var(--color-text);
    text-transform: uppercase;
    opacity: 0.6;

    &.large-font {
      font-size: 1.65em;
    }

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
</style>
