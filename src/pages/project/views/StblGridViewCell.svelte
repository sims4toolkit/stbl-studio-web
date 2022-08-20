<script lang="ts">
  import type Project from "src/lib/models/project";
  import { validateHexString } from "src/lib/utilities/tgi";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import CopyStringEntryButtons from "src/components/controls/CopyStringEntryButtons.svelte";
  import ResizableTextArea from "src/components/elements/ResizableTextArea.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let entry: LocalizedStringEntry;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let keyValue: string;
  let stringValue: string;
  let keyInput: HTMLInputElement;

  $: keyValueValid =
    keyValue != undefined ? validateHexString(keyValue, 8) : true;

  $: {
    project;
    updateKeyAndString();
  }

  function updateKeyAndString() {
    keyValue = formatStringKey(entry.key);
    const rawValue = project.stbl.getValue(entry.id);
    stringValue = rawValue.replace(/\\n/g, "\n");
  }

  function toggleSelection() {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleValue(entry);
      selectionGroup = selectionGroup;
    }
  }

  function onKeyInputBlur() {
    keyValue = keyValue.trim();

    if (keyValueValid) {
      const newKey = parseInt(keyValue, 16);
      project.stbl.setKey(entry.id, newKey);
      project.stbl.saveToStorage(project.uuid);
      project = project;
    } else {
      keyInput.focus();
    }
  }

  function saveString() {
    if (stringValue !== project.stbl.getValue(entry.id)) {
      project.setValue(entry.id, stringValue);
      project = project;
    }
  }
</script>

<button
  class="flex flex-col justify-start p-4 bg-gray-50 dark:bg-gray-700 rounded hacker-border-gray border border-gray-50 dark:border-gray-700 hacker-bg-black"
  class:selected={selectionGroup.isSelected(entry)}
  class:selectable={selectionGroup.selectMode}
  tabindex={selectionGroup.selectMode ? 0 : -1}
  on:click={toggleSelection}
>
  <div class="w-full">
    <div class="w-full flex justify-between mb-4">
      {#if selectionGroup.selectMode}
        <div class="flex items-center">
          <div
            class="select-indicator rounded-full h-4 w-4 border border-solid border-gray-500 dark:border-gray-400"
          />
        </div>
      {/if}
      <input
        bind:this={keyInput}
        class="bg-transparent text-red-600 dark:text-red-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 monospace rounded p-1 text-sm w-24"
        class:valid={keyValueValid}
        placeholder="0x00000000"
        type="text"
        bind:value={keyValue}
        on:blur={onKeyInputBlur}
        tabindex={selectionGroup.selectMode ? -1 : 0}
      />
      {#if !selectionGroup.selectMode}
        <CopyStringEntryButtons key={keyValue} string={stringValue} />
      {/if}
    </div>
    <ResizableTextArea
      bind:value={stringValue}
      placeholder="Empty string"
      fillWidth={true}
      tabindex={selectionGroup.selectMode ? -1 : 0}
      onBlur={saveString}
    />
  </div>
</button>

<style lang="scss">
  button {
    cursor: default;

    &.selectable {
      cursor: pointer;
      user-select: none;

      input {
        pointer-events: none;
      }

      & > div {
        pointer-events: none;
      }
    }
  }

  input.valid {
    color: var(--color-accent);
  }

  .selected {
    // !important only needed b/c hacker theme
    border: 1px solid var(--color-accent-secondary) !important;

    .select-indicator {
      border-color: var(--color-accent-secondary);
      background-color: var(--color-accent-secondary);
    }
  }
</style>
