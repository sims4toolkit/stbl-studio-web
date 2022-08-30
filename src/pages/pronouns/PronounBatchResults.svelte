<script lang="ts">
  import NavigationButton from "src/components/elements/NavigationButton.svelte";
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

<div class="pronoun-batch-results flex items-center w-full">
  <div class="w-full">
    <div class="flex justify-between">
      <NavigationButton
        direction="left"
        text="Previous STBL"
        onClick={previousStbl}
        active={currentStblIndex > 0}
      />
      <div class="text-center">
        <h2 class="font-bold text-2xl text-gradient drop-shadow">
          String Table {currentStblIndex + 1} of {batchFixResult.length}
        </h2>
        <p class="text-subtle uppercase monospace text-sm mt-4">
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
    <div class="batch-results-content my-8">
      {#if currentSlice.length === 0}
        <div class="no-changes flex items-center justify-center text-center">
          <div>
            <h3 class="mb-4 text-lg font-bold">No Changes!</h3>
            <p class="text-subtle">
              This string table does not contain any pronouns that need to be
              batch fixed.
            </p>
          </div>
        </div>
      {:else}
        {#each currentSlice as change, key (key)}
          <div class="change-container mx-8">
            <h4 class="mb-4">{formatStringKey(change.key)}</h4>
            <div class="comparison flex justify-between gap-4">
              <div>
                <p class="text-sm uppercase font-bold text-subtle">Before</p>
                <p class="text-subtle mt-2 mb-0">
                  {@html change.from}
                </p>
              </div>
              <div>
                <p class="text-sm uppercase font-bold text-subtle">After</p>
                <p class="text-subtle mt-2 mb-0">
                  {@html change.to}
                </p>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
    <div class="flex justify-between">
      <NavigationButton
        direction="left"
        text="Previous Strings"
        onClick={previousChunk}
        active={changeIndexStart > 0}
      />
      <p class="text-subtle text-sm">
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
      border: 1px solid var(--color-text-subtle);
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
