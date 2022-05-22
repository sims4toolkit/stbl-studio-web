<script lang="ts">
  import { fly } from "svelte/transition";
  import type Project from "../../../typescript/models/project";
  import FileInput from "../../elements/FileInput.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";

  export let onComplete: (project?: Project) => void;

  const animationDuration = 1000;

  let uploadedFiles: FileList;
  let filesInvalid = false;

  $: {
    if (uploadedFiles?.length) {
      // TODO:
      onComplete();
    }
  }
</script>

<div in:fly={{ y: -15, duration: animationDuration }}>
  <GradientHeader title="Upload String Tables" />
</div>
<div in:fly={{ y: 15, duration: animationDuration }}>
  <p class="my-2">Upload string tables as binaries, JSONs, or in a package.</p>
  <FileInput
    label="stbl, package, or json"
    bind:files={uploadedFiles}
    accept=".json,.bnry,.stbl,.binary,.package"
    multiple={true}
    bind:filesInvalid
  />
</div>

<style lang="scss">
  // intentionally blank
</style>
