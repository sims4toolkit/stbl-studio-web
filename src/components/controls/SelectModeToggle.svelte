<script lang="ts">
  import { fade } from "svelte/transition";
  import type SelectionGroup from "../../typescript/models/selection-group";

  export let selectionGroup: SelectionGroup<any, string | number>;
  export let disabled = false;

  $: isInSelectMode = selectionGroup.selectMode;
</script>

<div class="select-mode-toggle flex-center-h">
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
    {disabled}
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
  .select-mode-toggle {
    height: 42px;

    .select-toggle {
      border: none;
      background: none;
      color: var(--color-text);
      text-transform: uppercase;

      &.large-font {
        font-size: 1.65em;
      }

      &[disabled] {
        cursor: not-allowed;

        &,
        & span {
          color: var(--color-text-subtle);
        }
      }

      &:hover:not([disabled]) {
        &,
        & span {
          color: var(--color-text-subtle);
          cursor: pointer;
        }
      }
    }
  }
</style>
