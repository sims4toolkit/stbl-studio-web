<script lang="ts">
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import { fly } from "svelte/transition";
  import { Settings } from "../../../typescript/storage";

  export let selectionGroup: SelectionGroup<any, string | number>;
  export let item: any;
  export let disallowTabbing = false;

  $: itemSelected = selectionGroup.isSelected(item);
</script>

<button
  in:fly={{ x: -10, duration: Settings.reduceMotion ? 0 : 500 }}
  class:selected={itemSelected}
  tabindex={disallowTabbing ? -1 : 0}
  class="selected-indicator flex-center"
>
  {#if itemSelected}
    &#10003;
  {/if}
</button>

<style lang="scss">
  .selected-indicator {
    background: none;
    min-width: 16px !important;
    width: 16px;
    height: 16px;
    font-size: 12px;
    border-radius: 50%;
    border: 1px solid var(--color-text);
    padding: 2px;
    margin-right: 1em;

    &.selected {
      background-color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);
      color: var(--color-bg);
    }
  }
</style>
