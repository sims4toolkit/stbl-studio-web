<script lang="ts">
  import type { StringTableResource } from "@s4tk/models";
  import { onMount } from "svelte";
  import { parse } from "uuid";
  import Checkbox from "../../shared/elements/Checkbox.svelte";
  import IconTextButton from "../../shared/elements/IconTextButton.svelte";

  export let stbl: StringTableResource;

  let textarea: HTMLTextAreaElement;
  let wrapText = true;
  let fullHeight = false;

  let jsonContent = JSON.stringify(
    stbl?.entries.map((entry) => {
      return {
        key: entry.key,
        value: entry.value,
      };
    }) ?? "Loading...",
    null,
    2
  );

  onMount(() => {
    textarea.setAttribute("style", "height:" + textarea.scrollHeight + "px;");

    textarea.addEventListener("input", OnInput, false);
  });

  function OnInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
</script>

<div class="flex-space-between">
  <div class="flex flex-gap">
    <Checkbox label="Wrap text" bind:checked={wrapText} />
    <Checkbox label="Full height" bind:checked={fullHeight} />
  </div>
  <IconTextButton
    icon="save-outline"
    text="Save"
    onClick={() => {
      stbl.clear();
      stbl.addAll(JSON.parse(jsonContent));
    }}
  />
</div>

<textarea
  bind:this={textarea}
  class="drop-shadow monospace"
  bind:value={jsonContent}
  class:full-height={fullHeight}
  class:wrap-text={wrapText}
/>

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
