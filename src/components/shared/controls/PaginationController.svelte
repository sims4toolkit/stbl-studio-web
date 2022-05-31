<script lang="ts">
  import PaginationButton from "./PaginationButton.svelte";

  export let items: any[];
  export let itemsPerPage: number;
  export let onSliceUpdate: (slice: any[]) => void;

  let currentPage = 1;
  let firstButtonValue: number;
  let showFirstDots = false;
  let previousButtonValue: number;
  let inputValue = currentPage;
  let nextButtonValue: number;
  let showSecondDots = false;
  let lastButtonValue: number;

  $: numPages = Math.ceil(items.length / itemsPerPage);

  $: {
    items;
    itemsPerPage;
    currentPage;
    update();
  }

  async function update() {
    // buttons/input
    firstButtonValue = currentPage > 1 ? 1 : null;
    previousButtonValue = currentPage > 2 ? currentPage - 1 : null;

    if (firstButtonValue && previousButtonValue) {
      showFirstDots = firstButtonValue < previousButtonValue - 1;
    } else {
      showFirstDots = false;
    }

    nextButtonValue = currentPage < numPages - 1 ? currentPage + 1 : null;
    lastButtonValue = currentPage < numPages ? numPages : null;

    if (nextButtonValue && lastButtonValue) {
      showSecondDots = lastButtonValue > nextButtonValue + 1;
    } else {
      showSecondDots = false;
    }

    // slice
    const sliceStart = (currentPage - 1) * itemsPerPage;
    const sliceEnd = Math.min(sliceStart + itemsPerPage, items.length + 1);
    const slice = items.slice(sliceStart, sliceEnd);
    onSliceUpdate(slice);
  }

  function handleButtonClick(value: number) {
    inputValue = value;
    currentPage = value;
  }

  function handleInputChange() {
    if (!inputValue || inputValue < 1) {
      inputValue = 1;
    } else if (inputValue > numPages) {
      inputValue = numPages;
    }

    currentPage = inputValue;
  }
</script>

<div class="pagination flex-center-v flex-gap-small">
  <PaginationButton value={firstButtonValue} onClick={handleButtonClick} />
  {#if showFirstDots}
    <p class="dots my-0">•••</p>
  {/if}
  <PaginationButton value={previousButtonValue} onClick={handleButtonClick} />
  <input
    type="number"
    placeholder="#"
    bind:value={inputValue}
    on:change={handleInputChange}
  />
  <PaginationButton value={nextButtonValue} onClick={handleButtonClick} />
  {#if showSecondDots}
    <p class="dots my-0">•••</p>
  {/if}
  <PaginationButton value={lastButtonValue} onClick={handleButtonClick} />
</div>

<style lang="scss">
  .pagination {
    position: fixed;
    left: 25px;
    bottom: 25px;

    input {
      height: 35px;
      max-width: 80px;
      text-align: center;
      background-color: var(--color-bg);
    }
  }
</style>
