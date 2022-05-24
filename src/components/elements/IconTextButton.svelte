<script lang="ts">
  export let icon: string;
  export let text: string;
  export let onClick: () => void;
  export let active = true;

  let button: HTMLButtonElement;

  function onButtonClick() {
    button.blur();
    onClick();
  }
</script>

<button
  bind:this={button}
  class="flex-center-v py-half px-1"
  class:active
  on:click={onButtonClick}
>
  <img class="is-svg" src="./assets/{icon}.svg" alt={icon} />
  <p class="my-0">{text}</p>
</button>

<style lang="scss">
  button {
    background: none;
    color: var(--color-text);
    border: 1px solid var(--color-text);
    border-radius: 4px;

    img {
      height: 18px;
      width: auto;
      margin-right: 10px;
    }

    &.active:hover,
    &.active:focus {
      cursor: pointer;
      background-color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);
      color: var(--color-bg);

      img.is-svg {
        filter: var(--filter-svg-invert);
      }
    }

    &:not(.active) {
      border-color: var(--color-text-subtle);
      color: var(--color-text-subtle);
      pointer-events: none;

      &:hover {
        cursor: not-allowed;
      }
    }
  }
</style>
