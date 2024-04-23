<script lang="ts">
  import { fade } from "svelte/transition";
  import Settings from "src/lib/services/settings";
  import type { MultipageContentState } from "src/components/layouts/types";
  import type { ParsedFilesResult } from "src/lib/utilities/uploading";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import FileInput from "src/components/elements/FileInput.svelte";
  import { parseFiles } from "src/lib/utilities/uploading";
  import HelpWindow from "../windows/HelpWindow.svelte";

  export let startingPageNumber = 1;
  export let multipageState: MultipageContentState;
  export let parseResult: ParsedFilesResult;

  let uploadError: string;
  let files: FileList;
  let showJsonHelp = false;

  $: {
    if (files) parseUploadedFiles();
  }

  async function parseUploadedFiles() {
    uploadError = undefined;

    if (files.length < 1) {
      uploadError = "No files to read";
      return;
    }

    parseFiles(files)
      .then((result) => {
        parseResult = result;
        if (result.stbls.length >= 1) {
          if (result.errors.length >= 1) {
            multipageState.currentPage++;
          } else {
            multipageState.currentPage = 3;
          }

          multipageState.nextButtonEnabled = true;
        } else {
          uploadError = "No valid STBLs found";
        }
      })
      .catch((err) => {
        console.error(err);
        uploadError = "Something went wrong";
      });
  }
</script>

<MultipageContent pageNumber={startingPageNumber} bind:state={multipageState}>
  <div class="w-full flex flex-col gap-6">
    <div>
      <p>
        Upload string table(s) as binary, JSON, or in packages. For bulk strings
        that need unique keys generated, use a plain text file where each string
        is on its own line.
      </p>
      <p class="mt-1 text-xs text-subtle">
        You can upload all of your mod's packages; unneeded files will be
        ignored.
      </p>
    </div>
    <FileInput
      accept=".package,.stbl,.binary,.json,.txt"
      label="upload files"
      bind:files
      multiple={true}
      errorMessage={uploadError}
    />
    <div>
      <p class="text-xs text-subtle mb-2">
        If there are multiple tables for the same language, they will be merged.
        The best way to ensure that multiple languages are handled properly is
        by uploading them in packages.
      </p>
      <p class="text-xs text-subtle">
        Using JSON? Read about the expected structure <button
          class="text-secondary underline hover:no-underline"
          on:click={() => (showJsonHelp = !showJsonHelp)}>here</button
        >.
      </p>
    </div>
  </div>
</MultipageContent>
<MultipageContent
  pageNumber={startingPageNumber + 1}
  bind:state={multipageState}
>
  <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }} class="w-full">
    <p class="mb-3">
      Found {parseResult.stbls.length} valid string table(s) in {files.length -
        parseResult.errors.length} file(s).
    </p>
    {#if parseResult.errors.length === 0}
      <p>No uploaded files had errors.</p>
    {:else}
      <p class="mb-1">
        {parseResult.errors.length} file(s) either could not be read or did not contain
        any string tables.
      </p>
      <div class="max-h-24 overflow-x-hidden overflow-y-auto">
        <ul class="list-disc pl-8 flex flex-col">
          {#each parseResult.errors as err, key (key)}
            <li class="pl-2">
              <span
                class="text-accent-primary-light dark:text-accent-primary-dark hacker-text-lime"
                >{err.filename}</span
              >
              = {err.message}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</MultipageContent>

{#if showJsonHelp}
  <HelpWindow
    onClose={() => (showJsonHelp = false)}
    args={{ route: "/json" }}
  />
{/if}
