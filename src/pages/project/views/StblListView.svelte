<script lang="ts">
  import type Project from "src/lib/models/project";
  import StblListViewCell from "./StblListViewCell.svelte";

  export let project: Project;

  let entries = project.stbl.entries;
</script>

{#each entries as entry, key (key)}
  <StblListViewCell bind:entry />
{/each}
