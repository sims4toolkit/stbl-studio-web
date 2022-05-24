<script lang="ts">
  import { fly } from "svelte/transition";
  import { replace } from "svelte-spa-router";
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import { getLocaleData } from "../../../typescript/helpers/localization";

  export let project: Project;
  export let selectionGroup: SelectionGroup<Project>;

  $: isInSelectMode = selectionGroup.selectMode;
  $: projectSelected = selectionGroup.isSelected(project);
  $: localeCode = getLocaleData(project.primaryLocale).code;

  function handleClick() {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(project);
    } else {
      replace("/project/" + project.uuid);
    }
  }
</script>

<button
  class="button-wrapper text-color project-view drop-shadow hoverable w-100"
  class:selected={projectSelected}
  class:move-on-hover={!isInSelectMode}
  class:unselectable-text={isInSelectMode}
  on:click={handleClick}
>
  <div class="w-100">
    <div class="flex-center-v">
      {#if isInSelectMode}
        <div
          in:fly={{ x: -10, duration: 500 }}
          class:selected={projectSelected}
          class="selected-indicator flex-center"
        >
          {#if projectSelected}
            &#10003;
          {/if}
        </div>
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
    <div class="stbl-features w-100">
      <div class="stbl-feature">
        <p class="small-title">source</p>
        <p>{localeCode}</p>
      </div>
      <div class="stbl-feature">
        <p class="small-title">locales</p>
        <p>{project.numLocales}</p>
      </div>
      <div class="stbl-feature">
        <p class="small-title">strings</p>
        <p>{project.numStrings}</p>
      </div>
    </div>
  </div>
</button>

<style lang="scss">
  .project-view {
    background-color: var(--color-card);
    padding: 16px;
    border-radius: 8px;
    min-width: 300px;
    max-width: 100%;
    font-size: 1em;

    .selected-indicator {
      background: none;
      min-width: 16px !important;
      width: 16px;
      height: 16px;
      font-size: 12px;
      border-radius: 50%;
      border: 1px solid var(--color-text);
      padding: 2px;
      margin-right: 1em;

      &.selected {
        background-color: var(--color-accent-secondary);
        border-color: var(--color-accent-secondary);
        color: var(--color-bg);
      }
    }

    .stbl-features {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-top: 1em;

      .stbl-feature {
        flex: 1 1 0px;
        border: 1px solid var(--color-divider);
        border-radius: 4px;
        text-align: center;
        padding: {
          top: 6px;
          bottom: 6px;
          left: 12px;
          right: 12px;
        }

        p {
          margin: 0;
        }
      }
    }
  }
</style>
