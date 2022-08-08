<script lang="ts">
  import type { ParsedFilesResult } from "../../../global";
  import StblUploadInput from "../../shared/controls/StblUploadInput.svelte";
  import FileInput from "../../shared/elements/FileInput.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  export let onComplete: () => void;

  let currentPage = 1;
  let uploadedFiles: FileList;
  let filesInvalid = false;

  function onNextButtonClick() {
    if (currentPage === 1) {
      currentPage++;
    } else if (currentPage === 2) {
      currentPage++;
    } else {
      onComplete();
    }
  }

  function onValidUpload(result: ParsedFilesResult) {
    console.log(result);

    // TODO:
  }
</script>

<MultipageModalContent
  title="Import Strings"
  canClickBack={false}
  numPages={3}
  completePages={currentPage}
  bind:currentPage
  finalPageNextButtonText="Import"
  {onNextButtonClick}
>
  <div slot="content" class="w-100">
    {#if currentPage === 1}
      <StblUploadInput {onValidUpload} />
    {:else if currentPage === 2}
      <p>page 2</p>
    {:else}
      <p>page 3</p>
    {/if}
  </div>
</MultipageModalContent>
