<script lang="ts">
  import GradientHeader from "../../../shared/elements/GradientHeader.svelte";
  import NavigationButton from "../../../shared/elements/NavigationButton.svelte";
  const { formatResourceInstance, formatStringKey } = window.S4TK.formatting;

  export let batchFixResult: BatchFixResult;

  let chunkSize = 10;

  let changeIndexStart = 0;
  let changeIndexEnd = 0;

  let currentStblIndex = 0;
  let currentStbl = batchFixResult[currentStblIndex];
  let currentSlice = getSlice();

  function getSlice(): StringChange[] {
    const nextEnd = changeIndexStart + chunkSize;

    changeIndexEnd =
      nextEnd <= currentStbl.changes.length
        ? nextEnd
        : currentStbl.changes.length;

    return currentStbl.changes.slice(changeIndexStart, changeIndexEnd);
  }

  function nextStbl() {
    changeIndexStart = 0;
    currentStblIndex++;
    currentStbl = batchFixResult[currentStblIndex];
    currentSlice = getSlice();
  }

  function previousStbl() {
    changeIndexStart = 0;
    currentStblIndex--;
    currentStbl = batchFixResult[currentStblIndex];
    currentSlice = getSlice();
  }

  function previousChunk() {
    changeIndexStart -= chunkSize;
    currentSlice = getSlice();
  }

  function nextChunk() {
    changeIndexStart = changeIndexEnd;
    currentSlice = getSlice();
  }
</script>

<div class="pronoun-batch-results flex-center-v w-100">
  <div class="w-100">
    <div class="flex-space-between">
      <NavigationButton
        direction="left"
        text="Previous STBL"
        onClick={previousStbl}
        active={currentStblIndex > 0}
      />
      <div class="text-center">
        <GradientHeader
          title="String Table {currentStblIndex + 1} of {batchFixResult.length}"
        />
        <p class="small-title mb-0">
          ID: {formatResourceInstance(currentStbl.stbl.key.instance)}
        </p>
      </div>
      <NavigationButton
        direction="right"
        text="Next STBL"
        active={currentStblIndex < batchFixResult.length - 1}
        onClick={nextStbl}
      />
    </div>
    <div class="batch-results-content my-2">
      {#if currentSlice.length === 0}
        <div class="no-changes flex-center text-center">
          <div>
            <h3>No Changes!</h3>
            <p>
              This string table does not contain any pronouns that need to be
              batch fixed.
            </p>
          </div>
        </div>
      {:else}
        {#each currentSlice as change, key (key)}
          <div class="change-container mx-1">
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
      {/if}
    </div>
    <div class="flex-space-between">
      <NavigationButton
        direction="left"
        text="Previous Strings"
        onClick={previousChunk}
        active={changeIndexStart > 0}
      />
      <p class="subtle-text my-0">
        Showing changes {changeIndexStart + 1} - {changeIndexEnd} of {currentStbl
          .changes.length}
      </p>
      <NavigationButton
        direction="right"
        text="Next Strings"
        active={changeIndexEnd < currentStbl.changes.length}
        onClick={nextChunk}
      />
    </div>
  </div>
</div>

<style lang="scss">
  .pronoun-batch-results {
    height: 90vh;

    .batch-results-content {
      overflow-y: auto;
      height: 65vh;

      .no-changes {
        height: 100%;
      }
    }

    .change-container {
      border: 1px solid var(--color-divider);
      padding: 1em;

      &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      &:not(:last-child) {
        border-bottom: none;
      }
    }

    .comparison > div {
      flex: 1;
    }
  }
</style>
