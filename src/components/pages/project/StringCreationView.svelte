<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import { Settings } from "../../../typescript/storage";
  import ResizableTextArea from "../../shared/elements/ResizableTextArea.svelte";
  const { fnv32 } = window.S4TK.hashing;

  export let project: Project;
  export let onComplete: () => void;

  let newStringTextarea: HTMLTextAreaElement;

  const keySubscriptions = [
    subscribeToKey("Escape", close),
    subscribeToKey("Enter", onComplete, {
      shift: true,
      preventDefault: true,
    }),
  ];

  onMount(() => {
    newStringTextarea.focus();
  });

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  function close() {
    newStringTextarea.value = "";
    onComplete();
  }

  function createStringEntry() {
    // timeout needed so that textarea can be cleared if X clicked
    setTimeout(() => {
      if (newStringTextarea.value) {
        const value = newStringTextarea.value.replace(/(?:\r\n|\r|\n)/g, "\\n");
        // TODO: should I generate new UUID instead?
        const key = fnv32(project.uuid + ":" + value);
        project.addEntry(key, value);
        project = project;
      }

      onComplete();
    }, 200);
  }
</script>

<div
  transition:fly={{ y: 20, duration: Settings.reduceMotion ? 0 : 500 }}
  class="creating-string-dialog-wrapper flex-center-h px-1"
>
  <div class="creating-string-dialog flex-col p-1">
    <div class="flex-space-between flex-center-v">
      <p class="small-title mt-0">enter new string</p>
      <button class="button-wrapper" on:click={close}>
        <img class="is-svg" src="./assets/x.svg" alt="X" />
      </button>
    </div>
    <ResizableTextArea
      bind:textarea={newStringTextarea}
      placeholder="New string..."
      onBlur={createStringEntry}
    />
    <p class="subtle-text mt-1 mb-0">
      Click anywhere or press <mark class="key">shift</mark> +
      <mark class="key">enter</mark>
      to save. Click X or press <mark class="key">esc</mark> to cancel.
    </p>
    <button class="button-wrapper save-button" />
  </div>
</div>

<style lang="scss">
  .creating-string-dialog-wrapper {
    z-index: 2048;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 100px;

    .creating-string-dialog {
      position: relative;
      min-height: 100px;
      border-radius: 8px;
      max-width: 1280px;
      width: 100%;
      background-color: var(--color-bg);

      button.save-button {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>
