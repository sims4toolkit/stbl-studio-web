<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "src/lib/utilities/keybindings";
  import Settings, {
    SettingsSubscriptionManager,
  } from "src/lib/services/settings";

  export let items: any[];
  export let onSliceUpdate: (slice: any[]) => void;

  let pageInput: HTMLInputElement;
  let currentPage = 1;
  let firstButtonValue: number;
  let showFirstDots = false;
  let previousButtonValue: number;
  let inputValue = currentPage;
  let nextButtonValue: number;
  let showSecondDots = false;
  let lastButtonValue: number;

  let itemsPerPage = Settings.showAllStrings
    ? items.length
    : Settings.entriesPerPage;

  const subscriptions = [
    SettingsSubscriptionManager.subscribe(
      "showAllStrings",
      (value: boolean) => {
        itemsPerPage = value ? items.length : Settings.entriesPerPage;
      }
    ),
    SettingsSubscriptionManager.subscribe("entriesPerPage", (value: number) => {
      itemsPerPage = Settings.showAllStrings ? items.length : value;
    }),
    subscribeToKey(
      "ArrowRight",
      () => {
        if (currentPage < numPages) {
          currentPage++;
          inputValue = currentPage;
        }
      },
      {
        ctrlOrMeta: true,
        preventDefault: true,
      }
    ),
    subscribeToKey(
      "ArrowLeft",
      () => {
        if (currentPage > 1) {
          currentPage--;
          inputValue = currentPage;
        }
      },
      {
        ctrlOrMeta: true,
        preventDefault: true,
      }
    ),
    subscribeToKey(
      "p",
      () => {
        pageInput.focus();
      },
      {
        ctrlOrMeta: true,
        preventDefault: true,
      }
    ),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: numPages = Math.ceil(items.length / itemsPerPage);

  $: {
    items;
    itemsPerPage;
    currentPage;
    update();
  }

  async function update() {
    if (items.length === 0) {
      firstButtonValue = null;
      previousButtonValue = null;
      nextButtonValue = null;
      lastButtonValue = null;
      showFirstDots = false;
      showSecondDots = false;
      onSliceUpdate(items);
      return;
    }

    if (currentPage > numPages) {
      inputValue = numPages;
      currentPage = numPages;
    }

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

<div class="fixed left-6 bottom-6 z-10 flex items-center gap-2">
  {#if firstButtonValue}
    <button on:click={() => handleButtonClick(firstButtonValue)}>
      {firstButtonValue}
    </button>
  {/if}
  {#if showFirstDots}
    <p class="dots my-0">•••</p>
  {/if}
  {#if previousButtonValue}
    <button on:click={() => handleButtonClick(previousButtonValue)}>
      {previousButtonValue}
    </button>
  {/if}
  <input
    bind:this={pageInput}
    class="placeholder:text-gray-400 dark:placeholder:text-gray-500"
    type="number"
    placeholder="#"
    bind:value={inputValue}
    on:change={handleInputChange}
    hidden={numPages <= 1}
  />
  {#if nextButtonValue}
    <button on:click={() => handleButtonClick(nextButtonValue)}>
      {nextButtonValue}
    </button>
  {/if}
  {#if showSecondDots}
    <p class="dots my-0">•••</p>
  {/if}
  {#if lastButtonValue}
    <button on:click={() => handleButtonClick(lastButtonValue)}>
      {lastButtonValue}
    </button>
  {/if}
</div>

<style lang="scss">
  input {
    height: 35px;
    max-width: 80px;
    text-align: center;
    background-color: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-text-subtle);
    border-radius: 4px;
    padding: {
      left: 8px;
      right: 8px;
      top: 4px;
      bottom: 4px;
    }
  }

  button {
    background-color: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-text-subtle);
    border-radius: 4px;
    padding: {
      left: 8px;
      right: 8px;
      top: 4px;
      bottom: 4px;
    }

    &:hover {
      background-color: var(--color-accent);
      color: var(--color-bg);
      border-color: var(--color-accent);
      cursor: pointer;
    }
  }
</style>
