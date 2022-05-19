<script lang="ts">
  import type { Selectable } from "../../global";
  import { fade } from "svelte/transition";

  export let selectMode: boolean;
  export let selectables: Selectable[];

  function changeAll(selected: boolean) {
    selectables.forEach((s) => {
      s.selected = selected;
    });

    selectables = selectables;
  }

  const selectAll = () => changeAll(true);

  const deselectAll = () => changeAll(false);

  function toggleSelectMode() {
    selectMode = !selectMode;
    if (!selectMode) deselectAll();
  }
</script>

<div class="flex-center-h">
  {#if selectMode}
    <button class="select-toggle" on:click={selectAll} in:fade
      >select all</button
    >
    <button class="select-toggle" on:click={deselectAll} in:fade
      >deselect all</button
    >
  {/if}
  <button
    class="select-toggle"
    class:large-font={selectMode}
    on:click={toggleSelectMode}
  >
    {#if selectMode}
      <span in:fade>&times;</span>
    {:else}
      <span in:fade>select</span>
    {/if}
  </button>
</div>

<style lang="scss">
  .select-toggle {
    border: none;
    background: none;
    color: var(--color-text);
    text-transform: uppercase;
    opacity: 0.65;

    &.large-font {
      font-size: 1.65em;
    }

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
</style>
