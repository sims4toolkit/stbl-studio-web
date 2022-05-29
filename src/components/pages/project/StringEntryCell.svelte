<script lang="ts">
  import type { StringEntry } from "@s4tk/models/types";
  import { onMount } from "svelte";
  import CopyButton from "./CopyButton.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let mode: "view" | "edit" | "select" = "view";
  export let stringEntry: StringEntry;
  export let onEdit: () => void;

  // to prevent it from saving on every keystroke
  let keyValue = formatStringKey(stringEntry.key);
  let stringValue = stringEntry.string.replaceAll("\\n", "\n");
  let stringInput: HTMLTextAreaElement;
  let numRowsOnExpand = 1;

  $: copyDisabled = mode === "edit";

  $: {
    stringValue;
    if (stringInput) refreshTextAreaRows();
  }

  onMount(() => {
    refreshTextAreaRows();
  });

  function refreshTextAreaRows() {
    numRowsOnExpand = Math.min(
      Math.ceil((stringInput.scrollHeight - 4) / stringInput.clientHeight),
      5
    );
  }

  function handleInputDoubleClick(e: MouseEvent) {
    e.preventDefault();
    refreshTextAreaRows();
    if (mode === "view") mode = "edit";
  }

  function handleInputSingleClick(e: MouseEvent) {
    setTimeout(() => {
      if (mode === "edit") {
        (e.target as HTMLInputElement).focus();
      }
    }, 50);
  }

  function handleInputBlur(e: FocusEvent) {
    mode = "view";
    stringEntry.key = parseInt(keyValue);
    stringEntry.value = stringValue.replace(/(?:\r\n|\r|\n)/g, "\\n");
    onEdit();
  }

  function handleEditButtonClick(e: MouseEvent) {
    mode = "edit";
    stringInput.focus();
  }
</script>

<div class="string-entry-cell w-100 flex-center-v flex-gap px-1 py-1">
  {#if mode === "select"}
    <div>hi</div>
  {/if}

  <div class="input-wrapper flex-center-v">
    <div class="input-copy-position" class:hidden={copyDisabled}>
      <CopyButton
        title="Copy key"
        textGenerator={() => keyValue}
        smallIcon={true}
      />
    </div>
    <textarea
      type="text"
      rows="1"
      class="monospace key-input accent-color"
      readonly={mode !== "edit"}
      tabindex={mode === "edit" ? 0 : -1}
      placeholder="Key..."
      bind:value={keyValue}
      on:dblclick={handleInputDoubleClick}
      on:click={handleInputSingleClick}
      on:blur={handleInputBlur}
    />
  </div>

  <div class="input-wrapper w-100 flex-center-v">
    <div class="input-copy-position" class:hidden={copyDisabled}>
      <CopyButton
        title="Copy string"
        textGenerator={() => stringValue}
        smallIcon={true}
      />
    </div>
    <textarea
      bind:this={stringInput}
      type="text"
      rows={mode === "edit" ? numRowsOnExpand : 1}
      class="w-100"
      readonly={mode !== "edit"}
      tabindex={mode === "edit" ? 0 : -1}
      placeholder={"{0.SimFirstName} is reticulating {0.SimPronounPossessiveDependent} splines!"}
      bind:value={stringValue}
      on:dblclick={handleInputDoubleClick}
      on:click={handleInputSingleClick}
      on:blur={handleInputBlur}
    />
  </div>

  {#if mode === "view"}
    <CopyButton
      title="Copy key and string"
      textGenerator={() => `${keyValue}<!--${stringValue}-->`}
    />
    <button class="button-wrapper" on:click={handleEditButtonClick}>
      <img src="./assets/pencil.svg" alt="Edit" class="is-svg" />
    </button>
  {:else if mode === "edit"}
    <!-- Doesn't need an event, bluring the input will save automatically -->
    <button class="button-wrapper">
      <img src="./assets/save-outline.svg" alt="Copy" class="is-svg" />
    </button>
  {/if}
</div>

<style lang="scss">
  .string-entry-cell {
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

    textarea,
    textarea:focus {
      border: 1px solid var(--color-divider);
      overflow-x: hidden; // firefox bug
      border-radius: 4px;
      padding: 2px;
      background-color: transparent;
      cursor: text;
      resize: none;

      &.key-input {
        width: 105px;
      }

      &:read-only {
        border-color: var(--color-bg-secondary);
        outline: none;
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
        top: 0;
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

    img {
      height: 16px;
      width: auto;
    }
  }
</style>
