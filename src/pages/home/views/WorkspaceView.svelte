<script lang="ts">
  import type Workspace from "src/lib/models/workspace";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import SelectModeToggle from "src/components/controls/SelectModeToggle.svelte";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import ProjectView from "./ProjectView.svelte";

  export let workspace: Workspace;
  export let selectionGroup: SelectionGroup<Project, string>;
</script>

<div class="flex justify-between mb-8 flex-col sm:flex-row gap-8">
  <div>
    <SectionHeader title="My Workspace" />
  </div>
  <SelectModeToggle bind:selectionGroup />
</div>

<div class="workspace-view">
  {#each workspace.projects as project, key (key)}
    <ProjectView {project} bind:selectionGroup />
  {/each}
</div>

<style lang="scss">
  .workspace-view {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
