<script lang="ts">
  import { onMount } from "svelte";
  import type Project from "../../../typescript/models/project";
  import { validateHexString } from "../../../typescript/helpers/tgi";
  import Checkbox from "../../elements/Checkbox.svelte";
  import IconTextButton from "../../elements/IconTextButton.svelte";
  import ScreenDimmer from "../../layout/ScreenDimmer.svelte";
  import { parseStblJson } from "../../../typescript/helpers/json";

  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;

  let textarea: HTMLTextAreaElement;
  let wrapText = true;
  let fullHeight = false;
  let hasChanges = false;

  let jsonContent = JSON.stringify(
    project?.primaryStbl?.entries.map((entry) => {
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
      const entries = parseStblJson(jsonContent).entries;
      project.replaceEntries(entries);
      project = project;
      hasChanges = false;
    } catch (err) {
      console.error(err);
      alert(`Could not save string table.\n\n${err}`);
    }
  }
</script>

<div class="flex-space-between mb-1">
  <div class="flex flex-gap">
    <Checkbox label="Wrap text" bind:checked={wrapText} />
    <Checkbox label="Full height" bind:checked={fullHeight} />
  </div>
  <IconTextButton
    active={hasChanges}
    icon="save-outline"
    text="Save"
    disabledText="Saved!"
    onClick={saveJson}
  />
</div>

<p class="subtle-text">
  <u class="error-color bold">WARNING</u>: You should not be editing in JSON
  mode unless you know what you are doing. (1) You will not be asked to confirm
  whether you really want to delete entries, and
  <strong>changes are irreversible</strong>. (2) Changing keys in this mode will
  <strong>delete any and all translations</strong>
  for the entries whose keys you changed. (3)
  <strong>This mode does not autosave</strong>, and must be saved manually by
  clicking the button.
</p>
<p class="subtle-text mb-2">
  Confused about the syntax? Read about it <a
    href="#/help?title=json"
    target="_blank">here</a
  >.
</p>

<textarea
  bind:this={textarea}
  class="drop-shadow monospace"
  bind:value={jsonContent}
  class:full-height={fullHeight}
  class:wrap-text={wrapText}
  on:input={() => (hasChanges = true)}
/>

<style lang="scss">
  strong {
    color: inherit;
    text-decoration: underline;
  }

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
