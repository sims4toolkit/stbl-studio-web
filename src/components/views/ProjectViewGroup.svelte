<script lang="ts">
  import type Project from "../../models/project";
  import type SelectionGroup from "../../models/selection-group";
  import ProjectView from "./ProjectView.svelte";

  export let selectionGroup: SelectionGroup<Project>;
</script>

<div class="project-view-group">
  {#each selectionGroup.selectables as project, key (key)}
    <ProjectView bind:project bind:selectionGroup />
  {/each}
</div>

<style lang="scss">
  .project-view-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
</style>
