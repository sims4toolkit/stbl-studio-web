<script lang="ts">
  export let first = false;
  export let last = false;
  export let color: string;
  export let title: string;
  export let icon: string;
  export let disabled: boolean;
  export let toggleTitle: (text?: string, color?: string) => void;
  export let handleClick: () => void;

  let floatingActionButton: HTMLButtonElement;

  $: imagePath = `./assets/${icon}.svg`;

  function handleEnterOrFocus(e: MouseEvent | FocusEvent) {
    if (disabled) return;
    floatingActionButton.style.backgroundColor = color;
    floatingActionButton.style.borderColor = color;
    toggleTitle(title, color);
  }

  function handleLeaveOrBlur(e: MouseEvent | FocusEvent) {
    if (disabled) return;
    floatingActionButton.style.backgroundColor = "var(--color-bg)";
    floatingActionButton.style.borderColor = "var(--color-text)";
    toggleTitle();
  }
</script>

<button
  bind:this={floatingActionButton}
  class="floating-action-button flex-center"
  class:first
  class:last
  class:disabled
  on:mouseenter={handleEnterOrFocus}
  on:focus={handleEnterOrFocus}
  on:mouseleave={handleLeaveOrBlur}
  on:blur={handleLeaveOrBlur}
  on:click={() => {
    if (!disabled) handleClick();
  }}
>
  <img class="is-svg" src={imagePath} alt={title} />
</button>

<style lang="scss">
  .floating-action-button {
    $border-radius: 4px;

    height: 36px;
    width: 48px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-text);

    &.first {
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }

    &.last {
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }

    &:not(.last) {
      border-right: none;
    }

    &.disabled:hover {
      cursor: not-allowed;
    }

    &:not(.disabled):hover,
    &:not(.disabled):focus {
      cursor: pointer;

      img {
        filter: var(--filter-light);
      }
    }
  }
</style>
