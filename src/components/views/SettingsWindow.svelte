<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Settings from "src/lib/services/settings";
  import Checkbox from "src/components/elements/Checkbox.svelte";
  import Switch from "src/components/elements/Switch.svelte";

  export let onClose: () => void;
</script>

<MovableWindow title="Settings" {onClose}>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <h4 class="text-subtle uppercase text-sm font-bold">Accessibility</h4>
      <Switch label="Disable Blur" bind:checked={Settings.disableBlur} />
      <Switch label="Reduce Animations" bind:checked={Settings.reduceMotion} />
    </div>
    <hr class="border-gray-500 dark:border-gray-900" />
    <div class="flex flex-col gap-2">
      <h4 class="text-subtle uppercase text-sm font-bold">Accessibility</h4>
      <Switch label="Disable Blur" bind:checked={Settings.disableBlur} />
      <Switch label="Reduce Animations" bind:checked={Settings.reduceMotion} />
    </div>
    <hr class="border-gray-500 dark:border-gray-900" />
    <div class="flex flex-col gap-2">
      <button
        class="hover:bg-red-500 focus:bg-red-500 border border-red-500 h-10 flex items-center justify-center gap-4 rounded"
      >
        <img class="svg h-4" src="./assets/trash.svg" alt="Trash" />
        Reset Workspace
      </button>
    </div>
  </div>
</MovableWindow>

<style lang="scss">
  button:hover,
  button:focus {
    color: white;

    img {
      filter: var(--filter-light);
    }
  }
</style>
