<script lang="ts">
  import type Project from "src/lib/models/project";
  import StringListViewCell from "./StringListViewCell.svelte";

  export let project: Project;

  let entries = project.stbl.entries;
</script>

{#each entries as entry, key (key)}
  <StringListViewCell bind:entry />
{/each}
