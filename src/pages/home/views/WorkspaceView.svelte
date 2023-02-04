<script lang="ts">
  import type Workspace from "src/lib/models/workspace";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import SelectModeToggle from "src/components/controls/SelectModeToggle.svelte";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import ProjectView from "./ProjectView.svelte";
  import { ProjectFlags } from "src/lib/models/project";

  export let workspace: Workspace;
  export let selectionGroup: SelectionGroup<Project, string>;

  $: sortedProjects = [...workspace.projects].sort((p1, p2) => {
    const pin1 = p1.hasFlags(ProjectFlags.Pinned);
    const pin2 = p2.hasFlags(ProjectFlags.Pinned);
    if (pin1 !== pin2) return pin1 ? -1 : 1;

    const name1 = p1.metaData.name.toLowerCase();
    const name2 = p2.metaData.name.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  });
</script>

<div class="flex justify-between mb-8 flex-col sm:flex-row gap-8">
  <div>
    <SectionHeader title="My Workspace" />
  </div>
  <SelectModeToggle bind:selectionGroup />
</div>

<div class="workspace-view">
  {#each sortedProjects as project, key (key)}
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
