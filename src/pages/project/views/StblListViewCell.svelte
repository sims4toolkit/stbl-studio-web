<script lang="ts">
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import CopyStringEntryButtons from "src/components/controls/CopyStringEntryButtons.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let entry: LocalizedStringEntry;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let keyValue = formatStringKey(entry.key);
  let stringValue = entry.values.get(0); // FIXME: figure out how to get primary locale

  function toggleSelection() {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(entry);
      selectionGroup = selectionGroup;
    }
  }
</script>

<div
  class="flex items-center px-4 py-1 first:rounded-t last:rounded-b gap-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-800 hacker-border-gray"
  class:selected={selectionGroup.isSelected(entry)}
  class:selectable={selectionGroup.selectMode}
  on:click={toggleSelection}
>
  {#if selectionGroup.selectMode}
    <div class="flex items-center">
      <button
        class="select-indicator rounded-full h-4 w-4 border border-solid border-gray-500 dark:border-gray-400"
        on:click={toggleSelection}
      />
    </div>
  {/if}
  <h4 class="text-sm text-primary monospace">{keyValue}</h4>
  <input
    class="bg-gray-75 dark:bg-gray-675 rounded w-full px-2 py-1"
    placeholder="Empty String"
    type="text"
    bind:value={stringValue}
    tabindex={selectionGroup.selectMode ? -1 : 0}
  />
  {#if !selectionGroup.selectMode}
    <CopyStringEntryButtons key={keyValue} string={stringValue} />
  {/if}
</div>

<style lang="scss">
  .selectable {
    cursor: pointer;
    user-select: none;

    input {
      pointer-events: none;
    }
  }

  .selected {
    // !important only needed b/c hacker theme
    border: 1px solid var(--color-accent-secondary) !important;

    button.select-indicator {
      border-color: var(--color-accent-secondary);
      background-color: var(--color-accent-secondary);
    }
  }
</style>
