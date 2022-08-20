<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import CopyStringEntryButtons from "src/components/controls/CopyStringEntryButtons.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let entry: LocalizedStringEntry;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let keyValue: string;
  let stringValue: string;

  $: {
    keyValue = formatStringKey(entry.key);
    stringValue = project.stbl.getValue(entry.id);
  }

  function toggleSelection() {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(entry);
      selectionGroup = selectionGroup;
    }
  }
</script>

<button
  class="p-4 bg-gray-50 dark:bg-gray-700 rounded hacker-border-gray border border-gray-50 dark:border-gray-700 hacker-bg-black"
  class:selected={selectionGroup.isSelected(entry)}
  class:selectable={selectionGroup.selectMode}
  tabindex={selectionGroup.selectMode ? 0 : -1}
  on:click={toggleSelection}
>
  <div class="w-full flex justify-between mb-4">
    {#if selectionGroup.selectMode}
      <div class="flex items-center">
        <div
          class="select-indicator rounded-full h-4 w-4 border border-solid border-gray-500 dark:border-gray-400"
        />
      </div>
    {/if}
    <input
      class="bg-transparent text-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 monospace rounded p-1 text-sm w-24"
      placeholder="0x00000000"
      type="text"
      bind:value={keyValue}
      tabindex={selectionGroup.selectMode ? -1 : 0}
    />
    {#if !selectionGroup.selectMode}
      <CopyStringEntryButtons key={keyValue} string={stringValue} />
    {/if}
  </div>
  <input
    class="bg-gray-75 dark:bg-gray-675 rounded w-full px-2 py-1 placeholder:text-gray-400 dark:placeholder:text-gray-500"
    placeholder="Empty String"
    type="text"
    bind:value={stringValue}
    tabindex={selectionGroup.selectMode ? -1 : 0}
  />
</button>

<style lang="scss">
  button {
    cursor: default;

    &.selectable {
      cursor: pointer;
      user-select: none;

      input {
        pointer-events: none;
      }
    }
  }

  .selected {
    // !important only needed b/c hacker theme
    border: 1px solid var(--color-accent-secondary) !important;

    .select-indicator {
      border-color: var(--color-accent-secondary);
      background-color: var(--color-accent-secondary);
    }
  }
</style>
