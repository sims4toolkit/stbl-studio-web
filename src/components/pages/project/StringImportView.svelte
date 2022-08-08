<script lang="ts">
  import type { ParsedFilesResult } from "../../../global";
  import StblUploadInput from "../../shared/controls/StblUploadInput.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  //#region Variables

  export let onComplete: () => void;

  let currentPage = 1;
  let completePages = 0;
  let parsedFilesResult: ParsedFilesResult;

  //#endregion Variables

  //#region Reactive Blocks

  $: {
    if (parsedFilesResult?.stbls.length && completePages < 1) completePages = 1;
  }

  //#endregion Reactive Blocks

  //#region Functions

  function onNextButtonClick() {
    if (currentPage === 1) {
      onValidUpload(parsedFilesResult);
    } else if (currentPage === 2) {
      currentPage++;
    } else {
      onComplete();
    }
  }

  function onValidUpload(result: ParsedFilesResult) {
    console.log(result);
    currentPage++;
  }

  //#endregion Functions
</script>

<MultipageModalContent
  title="Import Strings"
  canClickBack={false}
  numPages={3}
  {completePages}
  bind:currentPage
  finalPageNextButtonText="Import"
  {onNextButtonClick}
>
  <div slot="content" class="w-100">
    {#if currentPage === 1}
      <StblUploadInput bind:parsedFilesResult {onValidUpload} />
    {:else if currentPage === 2}
      <p>page 2</p>
    {:else}
      <p>page 3</p>
    {/if}
  </div>
</MultipageModalContent>
