<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import type Project from "src/lib/models/project";
  import Settings, {
    prideFlagOverlayStore,
    rickGifStore,
  } from "src/lib/services/settings";
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
    prideFlagOverlayStore.set(false);
  });

  $: {
    if (!Settings.disableEasterEggs) runEasterEggs(value);
  }

  function runEasterEggs(value: string) {
    if (/(^|\s)+(hack|mainframe|i'?m\s+in)$/i.test(value)) {
      Settings.mainframeHacked = true;
      return;
    } else if (Settings.mainframeHacked && !mainframeWasHacked) {
      Settings.mainframeHacked = false;
    }

    if (/(^|\s)+(give\s*\S*\s*up|let\s*\S*\s*down)$/i.test(value)) {
      rickGifStore.set(true);
      return;
    } else if (!wasShowingRick) {
      rickGifStore.set(false);
    }

    if (/(^|\s)+(gay|lgbt|lesbian|trans|bisexual)$/i.test(value)) {
      prideFlagOverlayStore.set(true);
      return;
    } else {
      prideFlagOverlayStore.set(false);
    }
  }

  function addString() {
    if (value.trim().length > 0) {
      project.addString(value);
      project = project;
    }

    if (promptUntilCancel) {
      value = "";
    } else {
      onComplete();
    }
  }
</script>

<div
  class="fixed left-0 right-0 bottom-0 pb-20 flex justify-center drop-shadow"
>
  <div
    class="flex flex-col gap-4 w-full rounded p-4 max-w-6xl mx-4 bg-gray-100 dark:bg-gray-800 hacker-bg-black"
    in:fly={{ y: 20, duration: Settings.reduceMotion ? 0 : 350 }}
  >
    <div class="w-full flex justify-between">
      <p class="text-subtle text-sm uppercase font-bold">new string</p>
      <div class="max-w-min whitespace-nowrap">
        <Switch label="Prompt Until Cancel" bind:checked={promptUntilCancel} />
      </div>
    </div>
    <ResizableTextArea
      placeholder="New string"
      fillWidth={true}
      focusOnMount={true}
      bind:value
      onEnter={addString}
    />
    <div class="w-full flex flex-wrap gap-2 justify-between items-center">
      <p class="text-subtle text-xs">
        Press <mark
          class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >esc</mark
        >
        to cancel,
        <mark class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >enter</mark
        >
        to save, and
        <mark class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >shift</mark
        >
        +
        <mark class="keystroke bg-gray-200 dark:bg-gray-700 hacker-bg-gray"
          >enter</mark
        > for newlines.
      </p>
      <div class="flex gap-2">
        <button
          class="text-sm border-gray-400 dark:border-gray-600 hover:bg-gray-400 dark:hover:bg-gray-600 focus:bg-gray-400 dark:focus:bg-gray-600 hover:text-white dark:hover:text-white focus:text-white focus:hover:text-white hacker-border-gray hover:hacker-bg-gray hover:hacker-text-lime"
          on:click={onComplete}>Cancel</button
        >
        <button class="save text-sm" on:click={addString}>Save</button>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  button {
    border-width: 1px;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;

    &.save {
      border-color: var(--color-accent-secondary);

      &:hover,
      &:focus {
        background-color: var(--color-accent-secondary);
        color: var(--color-bg);
      }
    }
  }

  mark {
    font-size: 0.675rem;
  }
</style>
