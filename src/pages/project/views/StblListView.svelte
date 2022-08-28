<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import StblListViewCell from "./StblListViewCell.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;
  export let sliceToRender: LocalizedStringEntry[];
</script>

{#each sliceToRender as entry (entry.id)}
  <StblListViewCell bind:project bind:entry bind:selectionGroup />
{/each}
