<script lang="ts">
  import { fade } from "svelte/transition";
  import type { StringEntry } from "@s4tk/models/types";
  import CopyButton from "./CopyButton.svelte";
  import { validateHexString } from "../../../typescript/helpers/tgi";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import SelectedIndicator from "../../shared/controls/SelectedIndicator.svelte";
  import ResizableTextArea from "../../shared/elements/ResizableTextArea.svelte";

  const { formatStringKey } = window.S4TK.formatting;

  export let selectionGroup: SelectionGroup<StringEntry>;
  export let mode: "view" | "edit" = "view";
  export let isGrid = false;
  export let stringEntry: StringEntry;
  export let onEdit: () => void;

  let keyValue = formatStringKey(stringEntry.key);
  let stringValue = stringEntry.value.replaceAll("\\n", "\n");
  let isKeyInvalid = false;

  $: isSelected = selectionGroup.isSelected(stringEntry);

  $: copyDisabled = mode === "edit" || selectionGroup.selectMode;

  $: {
    isKeyInvalid = !validateHexString(keyValue, 8);
  }

  function handleInputFocus(e: FocusEvent) {
    mode = "edit";
  }

  function handleInputBlur(e: FocusEvent) {
    if (isKeyInvalid) {
      (e.target as HTMLTextAreaElement).focus();
    } else {
      mode = "view";
      stringEntry.key = parseInt(keyValue, 16);
      keyValue = formatStringKey(stringEntry.key);
      console.log(stringValue);
      stringEntry.value = stringValue.replace(/(?:\r\n|\r|\n)/g, "\\n");
      onEdit();
    }
  }

  function handleBodyClick(e: MouseEvent) {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(stringEntry);
    }
  }
</script>

<div
  class="string-entry-edit-cell p-1 flex"
  class:drop-shadow={isGrid}
  class:grid-item={isGrid}
  class:is-selecting={selectionGroup.selectMode}
  class:is-selected={isSelected}
  on:click={handleBodyClick}
>
  {#if selectionGroup.selectMode}
    <div class="flex-center-v h-100">
      <SelectedIndicator {selectionGroup} item={stringEntry} />
    </div>
  {/if}
  <div class="flex-col w-100">
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
          <textarea
            class="key-textarea accent-color monospace"
            disabled={selectionGroup.selectMode}
            rows="1"
            bind:value={keyValue}
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
        {#if !selectionGroup.selectMode}
          <CopyButton
            title="Copy key and comment"
            textGenerator={() => `${keyValue}<!--${stringValue}-->`}
          />
        {/if}
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
      <ResizableTextArea
        bind:refresher={isGrid}
        bind:value={stringValue}
        disabled={selectionGroup.selectMode}
        placeholder={"{0.SimFirstName} is reticulating {0.SimPronounPossessiveDependent} splines!"}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </div>
  </div>
</div>

<style lang="scss">
  .string-entry-edit-cell {
    $border-radius: 8px;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-bg-secondary);
    user-select: none;

    &.is-selecting:hover {
      cursor: pointer;
    }

    &.is-selected {
      border-color: var(--color-accent-secondary);
    }

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

    textarea.key-textarea {
      resize: none;
      background-color: var(--color-bg-secondary);
      border-radius: 4px;
      padding: 8px;
      width: 100px;
      height: auto;
      overflow-x: hidden;
      overflow-y: hidden;

      &:not(:focus) {
        border: 1px solid var(--color-bg-secondary);
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
