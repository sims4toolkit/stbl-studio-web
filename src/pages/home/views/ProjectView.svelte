<script lang="ts">
  import { replace } from "svelte-spa-router";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import ProjectMetaDataView from "src/components/views/ProjectMetaDataView.svelte";
  import { ProjectFlags } from "src/lib/models/project";
  const { formatAsHexString } = window.S4TK.formatting;

  export let project: Project;
  export let selectionGroup: SelectionGroup<Project, string>;

  $: isInSelectMode = selectionGroup.selectMode;
  $: projectSelected = selectionGroup.isSelected(project);
  $: projectPinned = project.hasFlags(ProjectFlags.Pinned);
  $: projectCorrupt = project.hasFlags(ProjectFlags.Corrupt);

  function handleClick() {
    if (isInSelectMode) {
      selectionGroup.toggleValue(project);
    } else {
      replace("/project/" + project.uuid);
    }
  }
</script>

<button class="relative" on:click={handleClick}>
  {#if projectCorrupt}
    <img
      src="./assets/upload.svg"
      alt="Corrupt"
      title="Corrupt"
      class="svg-accent h-4 w-4 z-10 absolute top-2 right-2 -scale-x-100"
    />
  {:else if projectPinned}
    <img
      src="./assets/pin.svg"
      alt="Pin"
      title="Pinned"
      class="svg-accent h-4 w-4 z-10 absolute top-2 right-2 -scale-x-100"
    />
  {/if}
  <div
    class="project-view text-left p-4 rounded-md drop-shadow-md dark:bg-gray-700 bg-gray-50 hacker-border-gray hacker-bg-black"
    class:selected={projectSelected}
  >
    <div class="flex mb-4">
      {#if isInSelectMode}
        <div class="flex items-center pr-4">
          <div
            class="select-indicator rounded-full h-4 w-4 border border-solid border-gray-500 dark:border-gray-400"
          />
        </div>
      {/if}
      <div class="overflow-hidden">
        <h2
          class="font-bold text-lg mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {project.metaData.name}
        </h2>
        <p class="monospace text-subtle text-sm">
          {formatAsHexString(project.metaData.instance, 14, false)}
        </p>
      </div>
    </div>
    <ProjectMetaDataView {project} />
  </div>
</button>

<style lang="scss">
  button {
    min-width: 300px;
    max-width: 100%;
    position: relative;
    transition: top 350ms;
    top: 0;

    &:hover {
      top: -2px;
      cursor: pointer;
    }

    div.project-view {
      border: 1px solid transparent;
      border-radius: 0.375rem;

      &.selected {
        // !important only needed b/c hacker theme
        border-color: var(--color-accent-secondary) !important;

        .select-indicator {
          border-color: var(--color-accent-secondary);
          background-color: var(--color-accent-secondary);
        }
      }
    }
  }
</style>
