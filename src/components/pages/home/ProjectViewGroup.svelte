<script lang="ts">
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import ProjectView from "./ProjectView.svelte";

  export let selectionGroup: SelectionGroup<Project>;
</script>

<div class="floating-card-group">
  {#each selectionGroup.selectables as project, key (key)}
    <ProjectView bind:project bind:selectionGroup />
  {/each}
</div>

<style lang="scss">
  // intentionally blank
</style>
