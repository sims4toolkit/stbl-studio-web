<script lang="ts">
  import { replace } from "svelte-spa-router";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import ProjectMetaDataView from "src/components/views/ProjectMetaDataView.svelte";
  const { formatResourceInstance } = window.S4TK.formatting;

  export let project: Project;
  export let selectionGroup: SelectionGroup<Project, string>;

  $: isInSelectMode = selectionGroup.selectMode;
  $: projectSelected = selectionGroup.isSelected(project);

  function handleClick() {
    if (isInSelectMode) {
      selectionGroup.toggleValue(project);
    } else {
      replace("/project/" + project.uuid);
    }
  }
</script>

<button on:click={handleClick}>
  <div
    class="text-left p-4 rounded-md drop-shadow-md dark:bg-gray-700 bg-gray-50"
    class:selected={projectSelected}
  >
    <h2
      class="font-bold text-lg mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
    >
      {project.metaData.name}
    </h2>
    <p class="monospace text-subtle text-sm mb-4">
      {formatResourceInstance(project.metaData.instance)}
    </p>
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

    div.selected {
      border: 1px solid var(--color-accent-secondary);
      border-radius: 0.375rem;
    }
  }
</style>
