<script lang="ts">
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import CopyStringEntryButtons from "src/components/controls/CopyStringEntryButtons.svelte";

  const { formatStringKey } = window.S4TK.formatting;

  export let entry: LocalizedStringEntry;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let keyValue = formatStringKey(entry.key);
  let stringValue = entry.values.get(0); // FIXME: figure out how to get primary locale
</script>

<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded hacker-border-gray">
  <div class="w-full flex justify-between mb-4">
    <h4 class="text-sm text-primary monospace">{keyValue}</h4>
    {#if !selectionGroup.selectMode}
      <CopyStringEntryButtons key={keyValue} string={stringValue} />
    {/if}
  </div>

  <input
    class="bg-gray-75 dark:bg-gray-675 rounded w-full px-2 py-1"
    placeholder="Empty String"
    type="text"
    bind:value={stringValue}
  />
</div>
