<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import StblGridViewCell from "./StblGridViewCell.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let entries = project.stbl.entries;
</script>

<div class="grid gap-4 drop-shadow-md">
  {#each entries as entry, key (key)}
    <StblGridViewCell bind:entry bind:selectionGroup />
  {/each}
</div>

<style lang="scss">
  div {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
</style>
