<script lang="ts">
  import { replace } from "svelte-spa-router";
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import SelectedIndicator from "../..//controls/SelectedIndicator.svelte";
  import StblFeatures from "../..//controls/StblFeatures.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<Project>;

  $: isInSelectMode = selectionGroup.selectMode;
  $: projectSelected = selectionGroup.isSelected(project);

  function handleClick() {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(project);
    } else {
      replace("/project/" + project.uuid);
    }
  }
</script>

<button
  class="button-wrapper"
  class:move-on-hover={!isInSelectMode}
  class:unselectable-text={isInSelectMode}
  on:click={handleClick}
>
  <div
    class="w-100 floating-card project-view drop-shadow move-on-hover"
    class:selected={projectSelected}
  >
    <div class="flex-center-v">
      {#if isInSelectMode}
        <SelectedIndicator
          bind:selectionGroup
          bind:item={project}
          disallowTabbing={true}
        />
      {/if}
      <div class="mw-100 text-left">
        <h3 class="mt-0 mb-half ml-0 nowrap-truncate mr-1">
          {project.name}
        </h3>
        <p class="subtle-color uppercase monospace my-0">
          {project.instanceBase.toString(16).padStart(14, "0")}
        </p>
      </div>
    </div>
    <StblFeatures {project} />
  </div>
</button>

<style lang="scss">
  button {
    border-radius: 8px;
  }

  .project-view {
    border: 1px solid var(--color-bg-secondary);

    &.selected {
      border-color: var(--color-accent-secondary);
    }
  }
</style>
