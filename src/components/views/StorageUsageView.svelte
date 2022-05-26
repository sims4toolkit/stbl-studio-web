<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { getTotalBytesUsed } from "../../typescript/storage";
  import { activeWorkspace } from "../../typescript/stores";

  const availableBytes = 5242880;
  let usedStorageBar: HTMLDivElement;
  let usedBytes = getTotalBytesUsed();

  $: usedMbText = (usedBytes / 1024 / 1024).toFixed(2);
  $: usedBytesPercent = (usedBytes / availableBytes) * 100;
  $: usedBytesPercentText = usedBytesPercent.toFixed(1) + "%";
  $: usedStorageBarWidth = usedBytesPercent.toFixed(0) + "%";
  $: isLowOnStorage = usedBytesPercent >= 90;

  function refresh() {
    usedBytes = getTotalBytesUsed();

    setTimeout(() => {
      // using timeout because there's some lag with computed properties
      usedStorageBar.style.width = usedStorageBarWidth;
    }, 10);
  }

  const unsubscribe = activeWorkspace.subscribe((value) => {
    if (value) refresh();
  });

  onMount(() => {
    usedStorageBar.style.width = usedStorageBarWidth;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="storage-usage-view">
  <p class="small-title my-0">Used storage</p>
  <div
    class="available-storage-bar drop-shadow my-1"
    class:storage-low={isLowOnStorage}
  >
    <div
      bind:this={usedStorageBar}
      class="used-storage-bar"
      class:storage-low={isLowOnStorage}
    />
  </div>
  <p class="subtle-text my-0">{usedMbText} / 5MB ({usedBytesPercentText})</p>
</div>

<style lang="scss">
  .storage-usage-view {
    $width: 222px;
    $height: 22px;
    $border-radius: 4px;

    .available-storage-bar {
      width: $width;
      height: $height;
      background-color: var(--color-accent-contrast);
      border-radius: $border-radius;

      &.storage-low {
        background-color: var(--color-error-contrast);
      }
    }

    .used-storage-bar {
      height: $height;
      background-color: var(--color-accent);
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;

      &.storage-low {
        background-color: var(--color-error);
      }
    }
  }
</style>
