<script lang="ts">
  import { fly } from "svelte/transition";
  import GradientHeader from "../../../elements/GradientHeader.svelte";
  import ContentArea from "../../../layout/ContentArea.svelte";
  import FileUploadParser from "./FileUploadParser.svelte";
  import PronounToolHeader from "./PronounToolHeader.svelte";
  import pronounReplacements from "../../../../data/pronoun-replacements.json";
  import ReplacementChoices from "./ReplacementChoices.svelte";
  import IconTextButton from "../../../elements/IconTextButton.svelte";
  import BlurOverlay from "../../../layout/BlurOverlay.svelte";
  import PronounBatchResults from "./PronounBatchResults.svelte";
  import Downloader from "../../../elements/Downloader.svelte";

  const { Package } = window.S4TK.models;

  let isReadingFiles = false;
  let numStblsToRead: number = null;
  let batchFixResult: BatchFixResult;
  let possibleReplacements = pronounReplacements;
  let viewChanges = false;
  let downloadingPackage = false;

  function onFilesRead(result: BatchFixResult) {
    setTimeout(() => {
      batchFixResult = result;
      isReadingFiles = false;
    }, 500);
  }

  function packageGenerator(): Blob {
    const pkg = new Package();
    batchFixResult.forEach(({ stbl }) => {
      pkg.add(stbl.key, stbl.value);
    });
    const buffer = pkg.getBuffer();
    return new Blob([buffer]);
  }
</script>

<svelte:head>
  <title>STBL Studio | Pronoun Batch Fix</title>
</svelte:head>
<section id="pronoun-batch-fix">
  <ContentArea banded={true}>
    <PronounToolHeader />
  </ContentArea>
  <ContentArea>
    <GradientHeader title="1) Select your replacements" />
    <ReplacementChoices bind:possibleReplacements />
    <GradientHeader title="2) Upload your string tables" />
    <FileUploadParser
      bind:isReadingFiles
      bind:numStblsToRead
      bind:possibleReplacements
      {onFilesRead}
    />
    {#if !isReadingFiles && numStblsToRead != null}
      <div in:fly={{ y: 20, duration: 250 }}>
        <GradientHeader title="3) All set!" />
        <div class="flex-space-around mt-2">
          <IconTextButton
            icon="eye-outline"
            text="View Changes"
            onClick={() => (viewChanges = true)}
            large={true}
          />
          <IconTextButton
            icon="download"
            text="Download"
            onClick={() => (downloadingPackage = true)}
            large={true}
            active={!downloadingPackage}
          />
        </div>
      </div>
    {/if}
  </ContentArea>
</section>

{#if viewChanges}
  <BlurOverlay onClose={() => (viewChanges = false)} large={true}>
    <PronounBatchResults slot="content" bind:batchFixResult />
  </BlurOverlay>
{/if}

{#if downloadingPackage}
  <Downloader
    filename="PronounBatchFix.package"
    onDownload={() => (downloadingPackage = false)}
    contentGenerator={packageGenerator}
  />
{/if}

<style lang="scss">
  // intentionally blank
</style>
