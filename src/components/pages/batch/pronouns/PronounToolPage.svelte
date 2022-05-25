<script lang="ts">
  import GradientHeader from "../../../elements/GradientHeader.svelte";
  import ContentArea from "../../../layout/ContentArea.svelte";
  import FileUploadParser from "./FileUploadParser.svelte";
  import PronounToolHeader from "./PronounToolHeader.svelte";
  import pronounReplacements from "../../../../data/pronoun-replacements.json";
  import ReplacementChoices from "./ReplacementChoices.svelte";

  const { formatResourceKey, formatStringKey } = window.S4TK.formatting;

  let isReadingFiles = false;
  let batchFixResult: BatchFixResult;
  let possibleReplacements = pronounReplacements;

  function onFilesRead(result: BatchFixResult) {
    batchFixResult = result;
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
    <FileUploadParser {isReadingFiles} {onFilesRead} {possibleReplacements} />
    <GradientHeader title="3) Wait while I work some magic..." />
    <div class="py-2">
      {#if batchFixResult}
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
