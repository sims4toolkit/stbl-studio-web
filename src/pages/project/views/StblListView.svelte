<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import StblListViewCell from "./StblListViewCell.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  $: entries = project.stbl.entries; // FIXME:
</script>

{#each entries as entry, key (key)}
  <StblListViewCell bind:entry bind:selectionGroup />
{/each}
