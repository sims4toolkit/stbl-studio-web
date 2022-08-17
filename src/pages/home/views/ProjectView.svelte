<script lang="ts">
  import type Project from "src/lib/models/project";

  export let project: Project;
  export let selected = false;
</script>

<button>
  <div
    class="p-4 rounded-md drop-shadow-md dark:bg-gray-700 bg-gray-50"
    class:selected
  >
    <p>{project}</p>
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
  }

  div.selected {
    border: 1px solid var(--color-accent-secondary);
    border-radius: 0.375rem;
  }
</style>
