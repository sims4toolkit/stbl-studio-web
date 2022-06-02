<script lang="ts">
  import { fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import FileInput from "../../shared/elements/FileInput.svelte";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";
  import { parseFiles } from "../../../typescript/helpers/uploads";
  import type { ParsedFilesResult } from "../../../global";

  export let onComplete: () => void;

  const uuid = uuidv4();
  let uploadedFiles: FileList;
  let filesInvalid = false;
  let currentPage = 1;
  let readingFiles = false;
  let parseResult: ParsedFilesResult;
  let reviewingErredFiles = false;

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);
  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  // FIXME: bug when you upload files that lead to filesInvalid = true, and then you upload files that are valid
  $: completePages =
    uploadedFiles && !filesInvalid ? currentPage : currentPage - 1;

  $: {
    if (uploadedFiles?.length) readFiles();
  }

  async function readFiles() {
    reviewingErredFiles = false;
    filesInvalid = false;
    readingFiles = true;

    parseResult = await parseFiles(uploadedFiles);
    setTimeout(() => {
      if (!parseResult.stbls.length) {
        uploadedFiles = null;
        readingFiles = false;
        filesInvalid = true;
      } else if (parseResult.errors.length) {
        reviewingErredFiles = true;
        // TODO:
      } else {
        // TODO:
        alert("all success");
      }
    }, 500);
  }
</script>

<MultipageModalContent
  title="Upload Project"
  subtitle="UUID: {uuid}"
  numPages={3}
  {completePages}
  bind:currentPage
  minimumContentHeight="220"
  centerVertically={true}
  finalPageNextButtonText="Create"
>
  <div slot="content">
    {#if currentPage === 1}
      {#if !readingFiles}
        <div in:fade>
          <p class="mt-0 mb-2">
            Upload the string table(s) you'd like to include in this project.
            They can be binary, JSON, or in packages. Feel free to upload all of
            the packages for your mod, unneeded files will be ignored.
          </p>
          <FileInput
            label="binaries, jsons, and/or packages only"
            bind:files={uploadedFiles}
            accept=".json,.stbl,.bnry,.binary,.package"
            multiple={true}
            bind:filesInvalid
            errorMessage="No valid STBLs found"
          />
          <div class="mt-2">
            <p class="subtle-text mt-0">
              If there are multiple tables with the same locale, they will be
              merged.
            </p>
            <p class="subtle-text mb-0">
              Using JSON? Read about the expected structure <a
                href="#/help?title=json"
                target="_blank">here</a
              >.
            </p>
          </div>
        </div>
      {:else if !reviewingErredFiles}
        <div in:fade>
          <h3>Extracting STBLs...</h3>
          <p>This might take a little bit.</p>
        </div>
      {:else}
        <div in:fade>
          <h3>{parseResult.errors.length} Error(s) Encountered</h3>
          <p>
            Some of your files either could not be read or did not contain valid
            STBL data. Don't worry - you can still create a project from the
            {parseResult.stbls.length} valid STBLs you uploaded.
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
      {/if}
    {/if}
  </div>
</MultipageModalContent>

<style lang="scss">
  ul.error-summary {
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
