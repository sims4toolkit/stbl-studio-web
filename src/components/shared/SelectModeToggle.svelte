<script lang="ts">
  import { fade } from "svelte/transition";
  import type SelectionGroup from "../../models/selection-group";
  import type Project from "../../models/project";

  export let selectionGroup: SelectionGroup<Project>;

  $: isInSelectMode = selectionGroup.selectMode;
</script>

<div class="flex-center-h">
  {#if isInSelectMode}
    <button
      class="select-toggle"
      on:click={() => selectionGroup.selectAll()}
      in:fade>select all</button
    >
    <button
      class="select-toggle"
      on:click={() => selectionGroup.deselectAll()}
      in:fade>deselect all</button
    >
  {/if}
  <button
    class="select-toggle"
    class:large-font={isInSelectMode}
    on:click={() => selectionGroup.toggleSelectMode()}
  >
    {#if isInSelectMode}
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
