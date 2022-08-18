<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Settings from "src/lib/services/settings";
  import Switch from "src/components/elements/Switch.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import ResetWorkspaceView from "src/components/views/ResetWorkspaceView.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";

  export let onClose: () => void;

  let resettingWorkspace = false;
</script>

<MovableWindow title="Settings" {onClose}>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <h4 class="text-subtle uppercase text-sm font-bold">Accessibility</h4>
      <Switch label="Disable Blur Effect" bind:checked={Settings.disableBlur} />
      <Switch label="Reduce Animations" bind:checked={Settings.reduceMotion} />
      <Switch
        label="Single Toolbar Color"
        bind:checked={Settings.disableToolbarColors}
      />
    </div>
    <hr class="border-gray-500 dark:border-gray-900" />
    <div class="flex flex-col gap-2">
      <LocaleSelect
        label="default locale"
        fillWidth={true}
        bind:selected={Settings.defaultLocale}
      />
    </div>
    <hr class="border-gray-500 dark:border-gray-900" />
    <div class="flex flex-col gap-2">
      <button
        class="hover:bg-red-500 focus:bg-red-500 border border-red-500 h-10 flex items-center justify-center gap-4 rounded"
        on:click={() => (resettingWorkspace = true)}
      >
        <img class="svg h-4" src="./assets/trash.svg" alt="Trash" />
        Reset Workspace
      </button>
    </div>
  </div>
</MovableWindow>

{#if resettingWorkspace}
  <BlurOverlay onClose={() => (resettingWorkspace = false)}>
    <ResetWorkspaceView />
  </BlurOverlay>
{/if}

<style lang="scss">
  button:hover,
  button:focus {
    color: white;

    img {
      filter: var(--filter-light);
    }
  }
</style>
