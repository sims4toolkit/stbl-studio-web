<script lang="ts">
  import { onMount } from "svelte";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import StblDownloadView from "src/components/views/StblDownloadView.svelte";

  export let onComplete: () => void;
  export let selectionGroup: SelectionGroup<Project, string>;

  const projectsToDownload = selectionGroup.allSelectedItems;

  let stblsLoaded = false;

  $: quantityText =
    projectsToDownload.length === 1
      ? "1 project"
      : `${projectsToDownload.length} projects`;

  onMount(async () => {
    for (let i = 0; i < projectsToDownload.length; ++i)
      await projectsToDownload[i].loadStringTable();
    stblsLoaded = true;
  });
</script>

{#if stblsLoaded}
  <StblDownloadView
    {onComplete}
    title="Download Projects"
    detail="Download the {quantityText} you have selected."
    projects={projectsToDownload}
  />
{/if}
