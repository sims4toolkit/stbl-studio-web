<script lang="ts">
  import Workspace from "../../typescript/models/workspace";
  import { activeWorkspace } from "../../typescript/stores";
  import FileInput from "../elements/FileInput.svelte";
  import MultipageModalContent from "../layout/MultipageModalContent.svelte";

  export let onSuccessfulUpload: () => void;

  let files: FileList;
  let filesInvalid = false;

  $: {
    if (files?.length) {
      readWorkspaceFile();
    }
  }

  async function readWorkspaceFile() {
    try {
      filesInvalid = false;
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = window.S4TK.Node.Buffer.from(arrayBuffer);
      const json = JSON.parse(buffer.toString());
      const workspace = await Workspace.restoreFromJson(json);
      activeWorkspace.set(workspace);
      onSuccessfulUpload();
    } catch (err) {
      console.error(err);
      filesInvalid = true;
    }
  }
</script>

<MultipageModalContent
  title="Welcome Back"
  showProgress={false}
  showNextButton={false}
>
  <div slot="content">
    <p class="mt-0 mb-2">
      Upload your workspace file to pick up where you left off.
    </p>
    <FileInput
      label="workspace json only"
      errorMessage="File is not a valid workspace"
      accept=".json"
      bind:files
      bind:filesInvalid
    />
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
