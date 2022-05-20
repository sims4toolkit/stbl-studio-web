<script lang="ts">
  import type { StblProject } from "../../global";
  import { fly } from "svelte/transition";
  import { replace } from "svelte-spa-router";
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
      replace("/project/" + project.id);
    }
  }
</script>

<div
  class="project-view drop-shadow hoverable w-100"
  class:selected={project.selected}
  class:move-on-hover={!selectMode}
  on:click={handleClick}
>
  <div class="w-100">
    <div class="flex-center-v">
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
      <div class="mw-100">
        <h3 class="my-0 accent-color nowrap-truncate mr-1">
          {project.name}
        </h3>
        <p class="instance monospace my-0">
          {project.instance.padStart(14, "0")}
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
