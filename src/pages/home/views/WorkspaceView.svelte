<script lang="ts">
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import type Workspace from "src/lib/models/workspace";
  import ProjectView from "./ProjectView.svelte";

  export let workspace: Workspace;
</script>

<div class="flex justify-between mb-8">
  <SectionHeader title="My Workspace" />
  <div>
    <p class="text-sm">SELECT</p>
  </div>
</div>

<div class="workspace-view">
  {#each workspace.projects as project, key (key)}
    <ProjectView {project} />
  {/each}
</div>

<style lang="scss">
  .workspace-view {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
