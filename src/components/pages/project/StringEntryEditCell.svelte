<script lang="ts">
  import { fade } from "svelte/transition";
  import type { StringEntry } from "@s4tk/models/types";
  import CopyButton from "./CopyButton.svelte";
  import { validateHexString } from "../../../typescript/helpers/tgi";

  const { formatStringKey } = window.S4TK.formatting;

  export let mode: "view" | "edit" | "select" = "view";
  export let isGrid = false;
  export let stringEntry: StringEntry;
  export let onEdit: () => void;

  let keyValue = formatStringKey(stringEntry.key);
  let stringValue = stringEntry.value.replaceAll("\\n", "\n");
  let isKeyInvalid = false;

  $: copyDisabled = mode === "edit";

  $: {
    isKeyInvalid = !validateHexString(keyValue, 8);
  }

  function handleInputFocus(e: FocusEvent) {
    mode = "edit";
  }

  function handleInputBlur(e: FocusEvent) {
    if (isKeyInvalid) {
      (e.target as HTMLInputElement).focus();
    } else {
      mode = "view";
      stringEntry.key = parseInt(keyValue, 16);
      keyValue = formatStringKey(stringEntry.key);
      console.log(stringValue);
      stringEntry.value = stringValue.replace(/(?:\r\n|\r|\n)/g, "\\n");
      onEdit();
    }
  }
</script>

<div
  class="string-entry-edit-cell p-1 flex-col"
  class:drop-shadow={isGrid}
  class:grid-item={isGrid}
>
  <div class="flex-space-between">
    <div class="input-wrapper">
      <div class="input-copy-position" class:hidden={copyDisabled}>
        <CopyButton
          title="Copy key"
          textGenerator={() => keyValue}
          smallIcon={true}
        />
      </div>
      <div class="flex-center-v">
        <div
          class="key-input accent-color monospace"
          contenteditable="true"
          bind:innerHTML={keyValue}
          on:focus={handleInputFocus}
          on:blur={handleInputBlur}
        />
        {#if isKeyInvalid}
          <p transition:fade class="subtle-text error-color my-0">
            &nbsp;• Must be 32-bit hex
          </p>
        {/if}
      </div>
    </div>
    <div>
      <CopyButton
        title="Copy key and comment"
        textGenerator={() => `${keyValue}<!--${stringValue}-->`}
      />
    </div>
  </div>
  <div class="input-wrapper mt-half" class:h-100={isGrid}>
    <div class="input-copy-position" class:hidden={copyDisabled}>
      <CopyButton
        title="Copy string"
        textGenerator={() => stringValue}
        smallIcon={true}
      />
    </div>
    <div
      class="string-input pre-wrap word-wrap"
      contenteditable="true"
      class:h-100={isGrid}
      placeholder={"{0.SimFirstName} is reticulating {0.SimPronounPossessiveDependent} splines!"}
      bind:innerHTML={stringValue}
      on:focus={handleInputFocus}
      on:blur={handleInputBlur}
    />
  </div>
</div>

<style lang="scss">
  .string-entry-edit-cell {
    $border-radius: 8px;
    background-color: var(--color-bg-secondary);
    user-select: none;

    &.grid-item {
      min-width: 420px;
      max-width: 100%;
      border-radius: $border-radius;
    }

    &:not(.grid-item) {
      &:first-child {
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
      }

      &:not(:first-child) {
        border-top: 2px solid var(--color-bg);
      }

      &:last-child {
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }
    }

    .input-wrapper {
      position: relative;

      &:hover .input-copy-position {
        display: inline-block;
      }

      .input-copy-position {
        display: none;
        background-color: var(--color-divider);
        border-radius: 4px;
        position: absolute;
        top: 2px;
        left: -24px;
        width: 24px;
        height: 24px;

        &:hover {
          opacity: 0.65;
          cursor: pointer;
        }

        &.hidden {
          display: none;
        }
      }
    }
  }
</style>
