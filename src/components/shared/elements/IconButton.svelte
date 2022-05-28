<script lang="ts">
  export let icon: string;
  export let onClick: () => void;
  export let active = true;
  export let title: string;

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
  class="flex-center-v p-half"
  class:active
  on:click={onButtonClick}
  {title}
>
  <img class="is-svg" src="./assets/{icon}.svg" alt={icon} />
</button>

<style lang="scss">
  button {
    background: none;
    border: 1px solid var(--color-divider);
    border-radius: 50%;

    img {
      height: 18px;
      width: auto;
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
