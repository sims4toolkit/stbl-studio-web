<script lang="ts">
  import { fade } from "svelte/transition";
  import Popover from "svelte-popover";

  export let smallIcon = false;
  export let title: string;
  export let textGenerator: () => string;

  let copiedPopoverVisible = false;

  function copyToClipboard() {
    navigator.clipboard.writeText(textGenerator());
  }
</script>

<Popover
  arrow={false}
  overlayColor={null}
  open={copiedPopoverVisible}
  on:open={() => {
    copiedPopoverVisible = true;
    setTimeout(() => {
      copiedPopoverVisible = false;
    }, 500);
  }}
>
  <button
    slot="target"
    class="button-wrapper"
    {title}
    on:click={copyToClipboard}
  >
    <img
      src="./assets/copy.svg"
      alt="Copy"
      class="is-svg"
      class:small-icon={smallIcon}
    />
  </button>
  <div
    slot="content"
    transition:fade={{ duration: 200 }}
    class="copied-bg p-half"
  >
    <p class="my-0 subtle-text">Copied!</p>
  </div>
</Popover>

<style lang="scss">
  .copied-bg {
    background-color: var(--color-card);
    border-radius: 4px;
  }

  button {
    width: 24px;
    height: 24px;
  }

  img {
    height: 16px;
    width: auto;

    &.small-icon {
      height: 12px;
      filter: var(--filter-light);
    }
  }
</style>
