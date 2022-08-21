<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Settings from "src/lib/services/settings";
  import Switch from "src/components/elements/Switch.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import ResetWorkspaceView from "src/components/views/ResetWorkspaceView.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";

  export let onClose: () => void;

  let resettingWorkspace = false;
  let page: "main" | "advanced" = "main";
</script>

<MovableWindow title="Settings" {onClose}>
  <div class="flex-1 flex flex-col gap-4">
    {#if page === "main"}
      <div class="flex-1 flex flex-col gap-4">
        <div class="flex-1 flex flex-col gap-4">
          <LocaleSelect
            label="default locale"
            fillWidth={true}
            bind:selected={Settings.defaultLocale}
          />
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
            <Switch
              label="Disable Easter Eggs"
              bind:checked={Settings.disableEasterEggs}
            />
            <p class="text-subtle text-xs mt-2">
              If you hate fun or want better performance.
            </p>
          </div>
          <div>
            <Switch
              label="Monochrome Toolbar"
              bind:checked={Settings.disableToolbarColors}
            />
            <p class="text-subtle text-xs mt-2">
              Disable color-coding of bottom-right toolbar.
            </p>
          </div>
          <div>
            <Switch
              label="Reduce Motion"
              bind:checked={Settings.reduceMotion}
            />
            <p class="text-subtle text-xs mt-2">
              Disable fly, fade, and transition animations.
            </p>
          </div>
        </div>
        <div class="w-full flex justify-end mb-2">
          <button
            class="text-subtle flex gap-2 items-center text-xs"
            on:click={() => (page = "advanced")}
          >
            Advanced
            <img class="svg h-2" src="./assets/chevron-right.svg" alt=">" />
          </button>
        </div>
      </div>
    {:else if page === "advanced"}
      <div class="flex-1 flex flex-col gap-4 justify-between">
        <div class="w-full flex flex-col gap-4">
          <div class="flex justify-between">
            <button
              class="w-12 text-subtle flex gap-2 items-center text-xs"
              on:click={() => (page = "main")}
            >
              <img class="svg h-2" src="./assets/chevron-left.svg" alt="<" />
              Back
            </button>
            <p class="text-sm font-bold">Advanced</p>
            <div class="w-12" />
          </div>
          <div>
            <Switch
              label="Disable Networking"
              bind:checked={Settings.rickGif}
            />
            <p class="text-subtle text-xs mt-2">
              This will never let you download.
            </p>
          </div>
          <div>
            <Switch
              label="Hack the Mainframe"
              bind:checked={Settings.mainframeHacked}
            />
            <p class="text-subtle text-xs mt-2">1010 0100 0101 0101</p>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <button
            class="setting hover:bg-red-500 focus:bg-red-500 border border-red-500 h-10 flex items-center justify-center gap-4 rounded"
            on:click={() => (resettingWorkspace = true)}
          >
            <img class="svg h-4" src="./assets/trash.svg" alt="Trash" />
            Delete Website Data
          </button>
        </div>
      </div>
    {/if}
  </div>
</MovableWindow>

{#if resettingWorkspace}
  <BlurOverlay onClose={() => (resettingWorkspace = false)}>
    <ResetWorkspaceView />
  </BlurOverlay>
{/if}

<style lang="scss">
  button.setting:hover,
  button.setting:focus {
    color: white;

    img {
      filter: var(--filter-light);
    }
  }
</style>
