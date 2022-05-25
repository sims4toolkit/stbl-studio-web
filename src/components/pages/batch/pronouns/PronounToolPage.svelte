<script lang="ts">
  import { fly } from "svelte/transition";
  import GradientHeader from "../../../elements/GradientHeader.svelte";
  import ContentArea from "../../../layout/ContentArea.svelte";
  import FileUploadParser from "./FileUploadParser.svelte";
  import PronounToolHeader from "./PronounToolHeader.svelte";
  import pronounReplacements from "../../../../data/pronoun-replacements.json";
  import ReplacementChoices from "./ReplacementChoices.svelte";
  import IconTextButton from "../../../elements/IconTextButton.svelte";

  const { formatResourceKey, formatStringKey } = window.S4TK.formatting;

  let isReadingFiles = false;
  let numStblsToRead: number;
  let batchFixResult: BatchFixResult;
  let possibleReplacements = pronounReplacements;
  let viewChanges = false;

  function onFilesRead(result: BatchFixResult) {
    setTimeout(() => {
      batchFixResult = result;
      isReadingFiles = false;
    }, 500);
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
    {#if !isReadingFiles && numStblsToRead !== undefined}
      <div in:fly={{ y: 20, duration: 250 }}>
        <GradientHeader title="3) All set!" />
        <div class="flex-space-around mt-3">
          <IconTextButton
            icon="eye-outline"
            text="View Changes"
            onClick={() => (viewChanges = true)}
            large={true}
          />
          <IconTextButton
            icon="download"
            text="Download Files"
            onClick={() => (viewChanges = true)}
            large={true}
          />
        </div>
      </div>
    {/if}
    <div class="py-2">
      {#if batchFixResult && false}
        {#each batchFixResult as stblSummary, key (key)}
          <div class="mb-1">
            <GradientHeader
              title={formatResourceKey(stblSummary.stbl.key, "-")}
            />
          </div>

          {#each stblSummary.changes as change, key (key)}
            <div class="change-container drop-shadow mb-1">
              <h4 class="my-0">{formatStringKey(change.key)}</h4>
              <div class="comparison flex-space-between flex-gap">
                <div>
                  <p class="small-title mb-0">Before</p>
                  <p class="subtle-text text-color mt-half mb-0">
                    {@html change.from}
                  </p>
                </div>
                <div>
                  <p class="small-title mb-0">After</p>
                  <p class="subtle-text text-color mt-half mb-0">
                    {@html change.to}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        {/each}
      {/if}
    </div>
  </ContentArea>
</section>

<style lang="scss">
  section#pronoun-batch-fix {
    .change-container {
      background-color: var(--color-card);
      border-radius: 8px;
      padding: 1em;
    }

    .comparison > div {
      flex: 1;
    }
  }
</style>
