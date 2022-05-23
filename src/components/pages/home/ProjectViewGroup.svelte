<script lang="ts">
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
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
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
