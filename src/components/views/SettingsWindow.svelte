<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Settings from "src/lib/services/settings";
  import Switch from "src/components/elements/Switch.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import ResetWorkspaceView from "src/components/views/ResetWorkspaceView.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";

  export let onClose: () => void;

  let resettingWorkspace = false;
  let doRickRoll = false;

  $: {
    if (doRickRoll) {
      const foundList = Settings.foundEasterEggs;
      if (!foundList.includes("rickroll")) {
        foundList.push("rickroll");
        Settings.foundEasterEggs = foundList;
      }

      window.location.href = "https://youtu.be/a3Z7zEc7AXQ?t=45";
    }
  }
</script>

<MovableWindow title="Settings" {onClose}>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <p class="uppercase text-sm font-bold">Accessibility</p>
      <div>
        <Switch
          label="Disable Blur Effect"
          bind:checked={Settings.disableBlur}
        />
        <p class="text-subtle text-xs mt-2">
          Make blurred backgrounds appear opaque.
        </p>
      </div>
      <div>
        <Switch label="Reduce Motion" bind:checked={Settings.reduceMotion} />
        <p class="text-subtle text-xs mt-2">
          Disable fly, fade, and transition animations.
        </p>
      </div>
      <div>
        <Switch
          label="Single Toolbar Color"
          bind:checked={Settings.disableToolbarColors}
        />
        <p class="text-subtle text-xs mt-2">
          Disable color-coding of bottom-right toolbar.
        </p>
      </div>
    </div>
    <hr class="border-gray-500 dark:border-gray-900" />
    <div class="flex flex-col gap-4">
      <p class="uppercase text-sm font-bold">Other</p>
      <LocaleSelect
        label="default primary locale"
        fillWidth={true}
        bind:selected={Settings.defaultLocale}
      />
      <div>
        <Switch label="Disable Downloading" bind:checked={doRickRoll} />
        <p class="text-subtle text-xs mt-2">Never lets you download.</p>
      </div>
    </div>
    <hr class="border-gray-500 dark:border-gray-900" />
    <div class="flex flex-col gap-2">
      <button
        class="hover:bg-red-500 focus:bg-red-500 border border-red-500 h-10 flex items-center justify-center gap-4 rounded"
        on:click={() => (resettingWorkspace = true)}
      >
        <img class="svg h-4" src="./assets/trash.svg" alt="Trash" />
        Delete Website Data
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
