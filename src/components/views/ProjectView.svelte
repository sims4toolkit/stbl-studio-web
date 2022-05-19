<script lang="ts">
  import type { StblProject } from "../../global";
  import { fly } from "svelte/transition";
  import { getLocaleCode } from "../../scripts/helpers";

  export let project: StblProject;
  export let selectMode: boolean;

  $: localeCode = getLocaleCode(project.primaryLocale);
  $: localeCount = project.stbls.length;
  $: stringCount = project.stbls.find(
    (stbl) => stbl.locale === project.primaryLocale
  ).entries.length;

  function handleClick() {
    if (selectMode) {
      project.selected = !project.selected;
    } else {
      // TODO: go to project
    }
  }
</script>

<div
  class="project-view drop-shadow hoverable"
  class:selected={project.selected}
  on:click={handleClick}
>
  {#if selectMode}
    <div
      in:fly={{ x: -10, duration: 500 }}
      class:selected={project.selected}
      class="selected-indicator flex-center"
    >
      {#if project.selected}
        &#10003;
      {/if}
    </div>
  {/if}
  <div class="w-100">
    <h3 class="my-0 accent-color">{project.name}</h3>
    <p class="instance monospace my-0">
      {project.instance.padStart(14, "0")}
    </p>
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
    display: flex;

    .selected-indicator {
      background: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid var(--color-text);
      padding: 2px;

      margin: {
        top: 4px;
        right: 1em;
      }

      &.selected {
        background-color: var(--color-accent-secondary);
        border-color: var(--color-accent-secondary);
        color: var(--color-bg);
      }
    }

    .instance {
      opacity: 0.65;
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
