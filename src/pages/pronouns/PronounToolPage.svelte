<script lang="ts">
  import { fly } from "svelte/transition";
  import pronounReplacements from "src/data/pronoun-replacements.json";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import FileUploadParser from "./FileUploadParser.svelte";
  import PronounToolHeader from "./PronounToolHeader.svelte";
  import ReplacementChoices from "./ReplacementChoices.svelte";
  import PronounBatchResults from "./PronounBatchResults.svelte";
  import { saveAs } from "file-saver";

  const { Package } = window.S4TK.models;

  let isReadingFiles = false;
  let numStblsToRead: number = null;
  let batchFixResult: BatchFixResult;
  let possibleReplacements = pronounReplacements;
  let viewChanges = false;

  function onFilesRead(result: BatchFixResult) {
    setTimeout(() => {
      batchFixResult = result;
      isReadingFiles = false;
    }, 500);
  }

  function downloadPackage() {
    const pkg = new Package();

    batchFixResult.forEach(({ stbl }) => {
      pkg.add(stbl.key, stbl.value);
    });

    const buffer = pkg.getBuffer();
    const blob = new Blob([buffer]);
    saveAs(blob, "PronounBatchFix.package");
  }
</script>

<svelte:head>
  <title>STBL Studio | Pronouns</title>
</svelte:head>

<section class="w-full flex flex-col justify-center">
  <PronounToolHeader />
  <div class="w-full flex justify-center">
    <div class="w-full xl:max-w-screen-xl py-8 px-4">
      <div class="flex flex-col gap-6">
        <div>
          <SectionHeader title="1) Select your replacements" />
          <ReplacementChoices bind:possibleReplacements />
        </div>
        <div>
          <SectionHeader title="2) Upload your string tables" />
          <FileUploadParser
            bind:isReadingFiles
            bind:numStblsToRead
            bind:possibleReplacements
            {onFilesRead}
          />
        </div>
        {#if !isReadingFiles && numStblsToRead != null}
          <div in:fly={{ y: 20, duration: 250 }}>
            <SectionHeader title="3) All set!" />
            <div class="flex justify-around mt-4">
              <button
                class="default-button flex items-center justify-center gap-4 px-4 py-2 text-lg rounded border border-black dark:border-white"
                on:click={() => (viewChanges = true)}
              >
                <img class="h-6" src="./assets/eye-outline.svg" alt="Eye" />
                View
              </button>
              <button
                class="default-button flex items-center justify-center gap-4 px-4 py-2 text-lg rounded border border-black dark:border-white"
                on:click={downloadPackage}
              >
                <img class="h-6" src="./assets/download.svg" alt="Download" />
                Download
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

{#if viewChanges}
  <BlurOverlay onClose={() => (viewChanges = false)} large={true} fill={true}>
    <PronounBatchResults bind:batchFixResult />
  </BlurOverlay>
{/if}

<!-- {#if downloadingPackage}
  <Downloader
    filename="PronounBatchFix.package"
    onDownload={() => (downloadingPackage = false)}
    contentGenerator={packageGenerator}
  />
{/if} -->
