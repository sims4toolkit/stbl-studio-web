<script lang="ts">
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
      <FileInput
        focusOnMount={true}
        label="binaries, jsons, and/or packages only"
        bind:files={uploadedFiles}
        accept=".json,.stbl,.bnry,.binary,.package"
        multiple={true}
        bind:filesInvalid
        errorMessage="No valid STBLs found"
      />
    {:else if currentPage === 2}
      <p>page 2</p>
    {:else}
      <p>page 3</p>
    {/if}
  </div>
</MultipageModalContent>
