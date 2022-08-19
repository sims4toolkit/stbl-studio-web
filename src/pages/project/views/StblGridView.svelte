<script lang="ts">
  import type Project from "src/lib/models/project";
  import StblGridViewCell from "./StblGridViewCell.svelte";

  export let project: Project;

  let entries = project.stbl.entries;
</script>

<div>
  {#each entries as entry, key (key)}
    <StblGridViewCell bind:entry />
  {/each}
</div>

<style lang="scss">
  div {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  }
</style>
