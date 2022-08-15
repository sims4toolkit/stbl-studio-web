<script lang="ts">
  export let icon: string;
  export let onClick: () => void;
  export let active = true;
  export let title: string;
  export let small = false;

  let button: HTMLButtonElement;

  function onButtonClick() {
    if (active) {
      onClick();

      setTimeout(() => {
        button.blur();
      }, 100);
    }
  }
</script>

<button
  bind:this={button}
  class="flex-center-v"
  class:active
  class:small
  on:click={onButtonClick}
  {title}
  tabindex={active ? 0 : -1}
>
  <img class="is-svg" class:small src="./assets/{icon}.svg" alt={icon} />
</button>

<style lang="scss">
  button {
    background: none;
    border: 1px solid var(--color-divider);
    border-radius: 50%;
    padding: 0.5em;

    &.small {
      border: none !important;
      padding: {
        left: 0.65em;
        right: 0.65em;
      }
    }

    img {
      height: 18px;
      width: auto;

      &.small {
        height: 14px;
      }
    }

    &.active:hover,
    &.active:focus {
      cursor: pointer;
      background-color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);

      img {
        filter: var(--filter-svg-invert);
      }
    }

    &:not(.active) {
      background-color: var(--color-card);
      border-color: var(--color-divider);
    }
  }
</style>
