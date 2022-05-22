<script lang="ts">
  import FileInput from "../../shared/FileInput.svelte";
  import GradientHeader from "../../shared/GradientHeader.svelte";

  export let onComplete: () => void;

  let uploadedFiles: FileList;
  let filesInvalid = false;
</script>

<GradientHeader title="Upload String Tables" />
<p>Upload string tables as binaries, JSONs, or in a package.</p>
<FileInput
  label="stbl, package, or json"
  bind:files={uploadedFiles}
  accept=".json,.bnry,.stbl,.binary,.package"
  multiple={true}
  bind:filesInvalid
/>

<style lang="scss">
  // intentionally blank
</style>
