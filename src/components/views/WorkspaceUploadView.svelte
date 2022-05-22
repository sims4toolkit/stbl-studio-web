<script lang="ts">
  import { fly } from "svelte/transition";
  import Workspace from "../../models/workspace";
  import { activeWorkspace } from "../../services/stores";

  export let onSuccess: () => void;

  let files: FileList;
  let fileIsInvalid = false;

  $: {
    if (files?.length) {
      readFile();
    }
  }

  async function readFile() {
    try {
      fileIsInvalid = false;
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = window.S4TK.Node.Buffer.from(arrayBuffer);
      const json = JSON.parse(buffer.toString());
      const workspace = await Workspace.restoreFromJson(json);
      activeWorkspace.set(workspace);
      onSuccess();
    } catch (err) {
      console.error(err);
      fileIsInvalid = true;
    }
  }
</script>

<div>
  <label for="file-upload" class="small-title">select json file</label>
  <input
    id="file-upload"
    name="file-upload"
    type="file"
    class:invalid={fileIsInvalid}
    class="w-100 mt-half"
    accept=".json"
    bind:files
  />
  {#if fileIsInvalid}
    <p in:fly={{ y: -20, duration: 800 }} class="subtle-text error-color mb-0">
      Could not restore workspace from file
    </p>
  {/if}
</div>

<style lang="scss">
  input[type="file"] {
    &:hover {
      cursor: pointer;
    }

    &::file-selector-button {
      display: none;
    }

    &.invalid {
      border-color: var(--color-error);
    }
  }
</style>
