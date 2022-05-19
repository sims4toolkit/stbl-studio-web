<script lang="ts">
  import type { Selectable } from "../../global";

  export let selectMode: boolean;
  export let selectables: Selectable[];

  $: selectModeToggleText = selectMode ? "X" : "select";

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

<div>
  {#if selectMode}
    <button class="select-toggle" on:click={selectAll}>select all</button>
    <button class="select-toggle" on:click={deselectAll}>deselect all</button>
  {/if}
  <button class="select-toggle" on:click={() => (selectMode = !selectMode)}
    >{selectModeToggleText}</button
  >
</div>

<style lang="scss">
  .select-toggle {
    border: none;
    background: none;
    color: var(--color-text);
    text-transform: uppercase;
    opacity: 0.6;

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
</style>
