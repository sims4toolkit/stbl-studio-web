<script lang="ts">
  import { onMount } from "svelte";

  export let icon: string;
  export let text: string;
  export let onClick: () => void;
  export let active = true;
  export let large = false;
  export let danger = false;
  export let fixedWidth: string = "";
  export let disabledText = "";
  export let border = true;

  let button: HTMLButtonElement;

  function onButtonClick() {
    if (active) {
      onClick();

      setTimeout(() => {
        button.blur();
      }, 100);
    }
  }

  onMount(() => {
    if (fixedWidth) {
      button.style.width = fixedWidth + "px";
    }
  });
</script>

<button
  bind:this={button}
  class="flex-center-v py-half px-1"
  class:active
  class:border
  class:large
  class:danger
  on:click={onButtonClick}
>
  <img class="is-svg" src="./assets/{icon}.svg" alt={icon} />
  {active ? text : disabledText}
</button>

<style lang="scss">
  button {
    background: none;
    color: var(--color-text);
    border-radius: 4px;

    &.border {
      border: 1px solid var(--color-text);
    }

    &:not(.border) {
      border: none;
    }

    img {
      height: 18px;
      width: auto;
      margin-right: 10px;
    }

    &.large {
      font-size: 1.2em;

      img {
        height: 32px;
      }
    }

    &.active:hover,
    &.active:focus {
      cursor: pointer;
      background-color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);
      color: var(--color-bg);

      &.danger {
        background-color: var(--color-error);
        border-color: var(--color-error);
        color: var(--color-light);

        img.is-svg {
          filter: var(--filter-light);
        }
      }

      &:not(.danger) {
        img.is-svg {
          filter: var(--filter-svg-invert);
        }
      }
    }

    &:not(.active) {
      border-color: var(--color-text-subtle);
      color: var(--color-text-subtle);
      cursor: not-allowed;

      &:hover {
        cursor: not-allowed;
      }

      img {
        opacity: 0.65;
      }
    }
  }
</style>
