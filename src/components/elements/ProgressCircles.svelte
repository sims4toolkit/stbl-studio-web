<script lang="ts">
  export let circles: number;
  export let filled: number;
  export let currentPage: number;
  export let clickable: number = 0;
  export let onClick: (index: number) => void = () => {};

  $: circleArray = Array(circles);

  function handleClick(index: number) {
    if (index < clickable) onClick(index);
  }
</script>

<div class="progress-circles">
  {#each circleArray as _, key (key)}
    <button
      class="button-wrapper"
      class:filled={key < filled}
      class:current-page={currentPage === key + 1}
      class:clickable={key < clickable}
      on:click={() => handleClick(key)}
    />
  {/each}
</div>

<style lang="scss">
  .progress-circles {
    display: flex;

    button {
      width: 20px;
      height: 20px;
      border: 1px solid var(--color-text);
      border-radius: 50%;

      &.current-page {
        // intentionally before filled class
        background-color: var(--color-accent-contrast);
        border-color: var(--color-accent-contrast);
      }

      &.filled {
        background-color: var(--color-accent);
        border-color: var(--color-accent);
      }

      &:not(.clickable),
      &.current-page {
        pointer-events: none;
      }

      &.clickable:hover {
        cursor: pointer;
      }

      &:not(:last-child) {
        margin-right: 6px;
      }
    }
  }
</style>
