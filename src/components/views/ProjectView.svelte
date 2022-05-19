<script lang="ts">
  import type { StblProject } from "../../global";

  export let project: StblProject;
  export let selectMode: boolean;

  function handleClick() {
    if (selectMode) {
      project.selected = !project.selected;
    } else {
      // TODO: go to project
    }
  }
</script>

<div class="project-view drop-shadow hoverable" on:click={handleClick}>
  {#if selectMode}
    <div
      class="selected-indicator flex-center"
      class:selected={project.selected}
    >
      {#if project.selected}
        &#10003;
      {/if}
    </div>
  {/if}
  <div>
    <h4 class="m-0">{project.name}</h4>
    <p class="monospace m-0">{project.instance}</p>
  </div>
</div>

<style lang="scss">
  .project-view {
    background-color: var(--color-card);
    padding: 16px;
    border-radius: 8px;
    display: flex;

    .selected-indicator {
      background: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid var(--color-text);
      margin-right: 1em;
      padding: 2px;

      &.selected {
        background-color: var(--color-accent-secondary);
        border-color: var(--color-accent-secondary);
        color: var(--color-bg);
      }
    }
  }
</style>
