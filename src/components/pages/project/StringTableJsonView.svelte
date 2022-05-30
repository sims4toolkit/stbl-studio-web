<script lang="ts">
  import type { StringTableResource } from "@s4tk/models";
  import { onMount } from "svelte";
  import { validateHexString } from "../../../typescript/helpers/tgi";
  import Checkbox from "../../shared/elements/Checkbox.svelte";
  import IconTextButton from "../../shared/elements/IconTextButton.svelte";
  import ScreenDimmer from "../../shared/layout/ScreenDimmer.svelte";

  const { formatStringKey } = window.S4TK.formatting;

  export let stbl: StringTableResource;

  let textarea: HTMLTextAreaElement;
  let wrapText = true;
  let fullHeight = false;
  let errorMsg = "";

  let jsonContent = JSON.stringify(
    stbl?.entries.map((entry) => {
      return {
        key: formatStringKey(entry.key),
        value: entry.value,
      };
    }) ?? "Loading...",
    null,
    2
  );

  onMount(() => {
    textarea.setAttribute("style", "height:" + textarea.scrollHeight + "px;");
    textarea.addEventListener("input", onInput, false);
  });

  function onInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  function saveJson() {
    try {
      const entries = JSON.parse(jsonContent).map(({ key, value }, i) => {
        if (!validateHexString(key, 8))
          throw new Error(
            `Key "${key}" of entry ${i} is not a valid 32-bit hex string.`
          );

        return {
          key: parseInt(key, 16), // FIXME: verify it's a uint32
          value,
        };
      });

      stbl.clear();
      stbl.addAll(entries);
    } catch (err) {
      console.error(err);
      errorMsg = err;
    }
  }
</script>

<div class="flex-space-between mb-1">
  <div class="flex flex-gap">
    <Checkbox label="Wrap text" bind:checked={wrapText} />
    <Checkbox label="Full height" bind:checked={fullHeight} />
  </div>
  <IconTextButton icon="save-outline" text="Save" onClick={saveJson} />
</div>

<p class="subtle-text mb-2">
  <u class="error-color bold">WARNING</u>: JSON view does not autosave. You must
  click the save button when you are finished.
</p>

<textarea
  bind:this={textarea}
  class="drop-shadow monospace"
  bind:value={jsonContent}
  class:full-height={fullHeight}
  class:wrap-text={wrapText}
/>

{#if errorMsg}
  <ScreenDimmer>
    <div class="flex-center h-100">
      {errorMsg}
      <button on:click={() => (errorMsg = "")}>OK</button>
    </div>
  </ScreenDimmer>
{/if}

<style lang="scss">
  textarea {
    resize: none;
    background-color: var(--color-bg-secondary);
    border-radius: 8px;
    padding: 8px;
    width: 100%;
    max-height: 60vh;
    overflow-y: auto;
    white-space: nowrap;

    &.full-height {
      max-height: none;
      overflow-y: hidden;
    }

    &.wrap-text {
      overflow-x: auto;
      white-space: pre-wrap;
    }
  }
</style>
