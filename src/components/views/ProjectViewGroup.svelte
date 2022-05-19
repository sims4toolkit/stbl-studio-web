<script lang="ts">
  import type { StblProject } from "../../global";
  import ProjectView from "./ProjectView.svelte";

  export let projects: StblProject[];
  export let selectMode: boolean;
</script>

<div class="project-view-group">
  {#each projects as project, key (key)}
    <ProjectView bind:project bind:selectMode />
  {/each}
</div>

<style lang="scss">
  .project-view-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
</style>
