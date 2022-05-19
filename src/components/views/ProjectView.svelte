<script lang="ts">
  import type { StblProject } from "../../global";

  export let project: StblProject;
  export let selectMode: boolean;
</script>

<div class="project-view drop-shadow">
  {#if selectMode}
    <button
      class="hoverable"
      class:selected={project.selected}
      on:click={() => (project.selected = !project.selected)}
    >
      {#if project.selected}
        &#10003;
      {/if}
    </button>
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

    button {
      background: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid var(--color-text);
      margin-right: 1em;
      padding: 0;

      &.selected {
        background-color: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--color-light);
      }
    }
  }
</style>
