<script lang="ts">
  import type Project from "../../models/project";
  import { fly } from "svelte/transition";
  import { replace } from "svelte-spa-router";
  import { getLocaleData } from "../../services/localization";
  import type SelectionGroup from "../../models/selection-group";

  export let project: Project;
  export let selectionGroup: SelectionGroup<Project>;

  $: isInSelectMode = selectionGroup.selectMode;
  $: projectSelected = selectionGroup.isSelected(project);
  $: localeCode = getLocaleData(project.primaryLocale).code;
  $: localeCount = project.stbls.length;
  $: stringCount = project.stbls.find(
    (stbl) => stbl.locale === project.primaryLocale
  ).stbl.entries.length;

  function handleClick() {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(project);
    } else {
      replace("/project/" + project.uuid);
    }
  }
</script>

<div
  class="project-view drop-shadow hoverable w-100"
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
      <div class="mw-100">
        <h3 class="mt-0 nowrap-truncate mr-1">
          {project.name}
        </h3>
        <p class="instance monospace my-0">
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
        <p>{localeCount}</p>
      </div>
      <div class="stbl-feature">
        <p class="small-title">strings</p>
        <p>{stringCount}</p>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .project-view {
    background-color: var(--color-card);
    padding: 16px;
    border-radius: 8px;
    flex: 1 1 0px;
    max-width: 305px; // (content area width - 60px) / 4

    h3 {
      margin-bottom: 0.5em;
    }

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

    .instance {
      opacity: 0.65;
      text-transform: uppercase;
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

        .small-title {
          opacity: 0.65;
          text-transform: uppercase;
          font-size: 0.65em;
          font-weight: bold;
        }
      }
    }
  }
</style>
