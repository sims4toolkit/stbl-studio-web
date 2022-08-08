<script lang="ts">
  import type { ParsedFilesResult } from "../../../global";
  import FileInput from "../elements/FileInput.svelte";
  import { parseFiles } from "../../../typescript/helpers/uploads";
  import { fade } from "svelte/transition";

  export let onValidUpload: (result: ParsedFilesResult) => void;

  let parseResult: ParsedFilesResult;
  let uploadedFiles: FileList;
  let filesInvalid = false;
  let reviewErrors = false;

  $: {
    if (uploadedFiles?.length) readFiles();
  }

  $: foundStbls =
    parseResult?.stbls.length > 1
      ? `${parseResult.stbls.length} valid STBLs that were found`
      : `1 valid STBL that was found`;

  async function readFiles() {
    filesInvalid = false;
    parseResult = await parseFiles(uploadedFiles);

    if (!parseResult.stbls.length) {
      filesInvalid = true;
      parseResult = null;
    } else {
      if (parseResult.errors.length) reviewErrors = true;
      onValidUpload(parseResult);
    }
  }
</script>

{#if reviewErrors}
  <div in:fade>
    <h3 class="mt-0">{parseResult.errors.length} Error(s) Encountered</h3>
    <p>
      Some files either could not be read or did not contain valid STBL data.
      Don't worry - you can still use the {foundStbls}.
    </p>
    <ul class="error-summary">
      {#each parseResult.errors as error, key (key)}
        <li>
          <span class="monospace accent-color">{error.filename}</span>
          &nbsp;=&nbsp;{error.reason}
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <div>
    <FileInput
      focusOnMount={true}
      label="binaries, jsons, and/or packages only"
      bind:files={uploadedFiles}
      accept=".json,.stbl,.bnry,.binary,.package"
      multiple={true}
      bind:filesInvalid
      errorMessage="No valid STBLs found"
    />
    <div class="mt-2">
      <p class="subtle-text mt-0">
        Upload as many string tables as you want. Unneeded files in packages
        will be ignored.
      </p>
      <p class="subtle-text mb-0">
        Using JSON? Read about the expected structure <a
          href="#/help?title=json"
          target="_blank">here</a
        >.
      </p>
    </div>
  </div>
{/if}
