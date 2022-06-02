<script lang="ts">
  import { onDestroy } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import FileInput from "../../shared/elements/FileInput.svelte";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  export let onComplete: () => void;

  const uuid = uuidv4();

  let uploadedFiles: FileList;
  let filesInvalid = false;
  let circlesFilled = 0;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  $: {
    if (uploadedFiles?.length) {
      // TODO: read files
    }
  }
</script>

<MultipageModalContent
  title="Upload Project"
  subtitle="UUID: {uuid}"
  numPages={3}
  completePages={0}
  currentPage={1}
  finalPageNextButtonText="Create"
>
  <div slot="content">
    <p class="mt-0 mb-2">
      Upload the string table(s) you'd like to include in this project. They can
      be binary, JSON, or in packages. Feel free to upload all of the packages
      for your mod, unneeded files will be ignored.
    </p>
    <FileInput
      label="binaries, jsons, and/or packages only"
      bind:files={uploadedFiles}
      accept=".json,.stbl,.bnry,.binary,.package"
      multiple={true}
      bind:filesInvalid
    />
    <div class="mt-2">
      <p class="subtle-text mt-0">
        If there are multiple tables with the same locale, they will be merged.
      </p>
      <p class="subtle-text mb-0">
        Using JSON? Read about the expected structure <a
          href="#/help?title=json"
          target="_blank">here</a
        >.
      </p>
    </div>
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
