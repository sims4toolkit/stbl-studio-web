<script lang="ts">
  import type { LocalizedStringTableIssue } from "src/lib/models/localized-stbl";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let warnings: LocalizedStringTableIssue[];
  export let onClose: () => void;
</script>

<MovableWindow title="Warnings" {onClose}>
  <div class="flex-1 flex flex-col gap-4">
    {#if warnings.length > 0}
      <div>
        {#if warnings.length === 1}
          <p>1 warning was found:</p>
        {:else}
          <p>{warnings.length} warnings were found:</p>
        {/if}
        <ul class="list-disc pl-4 mt-2">
          {#each warnings as warning, key (key)}
            <li class="px-2 mb-2">
              <p class="font-bold text-sm mb-1">{warning.message}</p>
              <p class="text-xs text-subtle">
                Found in {warning.idList.length}
                {warning.idList.length === 1 ? "entry" : "entries"}: [{warning.keyList
                  .map((key) => formatStringKey(key))
                  .join(", ")}]
              </p>
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <div class="text-center my-auto">
        <p>There are no warnings for this project.</p>
        <p class="text-xs text-subtle mt-4">Congrats, you fixed 'em.</p>
      </div>
    {/if}
  </div>
</MovableWindow>
