<script lang="ts">
  import type { StringEntry } from "@s4tk/models/types";
  import CopyButton from "./CopyButton.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let mode: "view" | "edit" | "select" = "view";
  export let stringEntry: StringEntry;
  export let onEdit: () => void;

  let keyValue = formatStringKey(stringEntry.key);
  let stringValue = stringEntry.value.replaceAll("\\n", "\n");

  function handleInputBlur() {
    mode = "view";
    stringEntry.key = parseInt(keyValue);
    stringEntry.value = stringValue.replace(/(?:\r\n|\r|\n)/g, "\\n");
    onEdit();
  }
</script>

<div class="string-entry-edit-cell p-1">
  <div class="flex-space-between">
    <div
      class="key-input accent-color monospace"
      contenteditable="true"
      bind:innerHTML={keyValue}
      on:blur={handleInputBlur}
    />
    <div>
      <CopyButton
        title="Copy key and comment"
        textGenerator={() => `${keyValue}<!--${stringValue}-->`}
      />
    </div>
  </div>
  <div
    class="string-input mt-1 pre-wrap word-wrap"
    contenteditable="true"
    bind:innerHTML={stringValue}
    on:blur={handleInputBlur}
  />
</div>

<style lang="scss">
  .string-entry-edit-cell {
    $border-radius: 8px;
    background-color: var(--color-bg-secondary);
    user-select: none;

    &:first-child {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    &:not(:first-child) {
      border-top: 1px solid var(--color-bg);
    }

    &:last-child {
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }
  }
</style>
