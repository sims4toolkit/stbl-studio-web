<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import StblListViewCell from "./StblListViewCell.svelte";
  import WindowManager from "src/lib/services/windows";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;
  export let sliceToRender: LocalizedStringEntry[];
</script>

{#if sliceToRender.length > 0}
  {#each sliceToRender as entry (entry.id)}
    <StblListViewCell bind:project bind:entry bind:selectionGroup />
  {/each}
{:else}
  <div
    class="w-full text-center py-12 px-4 border-2 border-dashed border-gray-400 dark:border-gray-600 hacker-border-gray"
  >
    {#if project.stbl.numEntries === 0}
      <h2 class="text-xl mb-4 text-subtle font-bold">This Project is Empty</h2>
      <p class="text-subtle mb-2">
        Add strings with the toolbar in the bottom-right corner.
      </p>
      <p class="text-subtle">
        Confused? Check out the <button
          class="text-secondary underline hover:no-underline"
          on:click={() => WindowManager.request("help")}>help menu</button
        >.
      </p>
    {:else}
      <h2 class="text-xl mb-4 text-subtle font-bold">Nothing to See Here</h2>
      <p class="text-subtle">
        No strings in this project match your search query.
      </p>
    {/if}
  </div>
{/if}
