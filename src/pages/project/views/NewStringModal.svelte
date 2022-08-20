<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import type Project from "src/lib/models/project";
  import Settings, { rickGifStore } from "src/lib/services/settings";
  import Switch from "src/components/elements/Switch.svelte";
  import ResizableTextArea from "src/components/elements/ResizableTextArea.svelte";

  export let project: Project;
  export let onComplete: () => void;

  let value = "";
  let promptUntilCancel = false;

  const mainframeWasHacked = Settings.mainframeHacked;
  const wasShowingRick = Settings.rickGif;

  onDestroy(() => {
    Settings.mainframeHacked = mainframeWasHacked;
    rickGifStore.set(Settings.rickGif);
  });

  $: {
    if (!Settings.disableEasterEggs) {
      if (/(^|\s)+(hack|mainframe|i'?m\s+in)$/i.test(value)) {
        Settings.mainframeHacked = true;
      } else if (Settings.mainframeHacked && !mainframeWasHacked) {
        Settings.mainframeHacked = false;
      } else if (/(^|\s)+(give\s*\S*\s*up|let\s*\S*\s*down)$/i.test(value)) {
        rickGifStore.set(true);
      } else if (!wasShowingRick) {
        rickGifStore.set(false);
      }
    }
  }

  function addString() {
    // FIXME: generate key and replace newlines
    project.stbl.addEntry(0, value);
  }
</script>

<div class="fixed left-0 right-0 bottom-0 pb-20 flex justify-center">
  <div
    class="flex flex-col gap-4 w-full rounded p-4 max-w-6xl mx-4 bg-gray-100 dark:bg-gray-800 hacker-bg-black"
    in:fly={{ y: 20, duration: Settings.reduceMotion ? 0 : 350 }}
  >
    <div class="w-full flex justify-between">
      <p class="text-subtle text-sm uppercase font-bold">new string</p>
      <button on:click={onComplete}>
        <img class="svg h-4" src="./assets/x.svg" alt="X" />
      </button>
    </div>
    <ResizableTextArea
      placeholder="New string"
      fillWidth={true}
      focusOnMount={true}
      bind:value
    />
    <div class="w-full flex flex-wrap gap-2 justify-between items-center">
      <p class="text-subtle text-xs">
        Press <mark
          class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >enter</mark
        >
        to save. Use
        <mark class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >shift</mark
        >
        +
        <mark class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >enter</mark
        > for newlines.
      </p>
      <div class="max-w-min whitespace-nowrap">
        <Switch label="Prompt Until Cancel" bind:checked={promptUntilCancel} />
      </div>
    </div>
  </div>
</div>
