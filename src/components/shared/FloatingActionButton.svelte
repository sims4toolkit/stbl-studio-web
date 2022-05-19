<script lang="ts">
  export let first = false;
  export let last = false;
  export let color: string;
  export let title: string;
  export let icon: string;
  export let toggleTitle: (text?: string, color?: string) => void;
  export let handleClick: () => void;

  let floatingActionButton: HTMLDivElement;

  $: imagePath = `./assets/${icon}.svg`;

  function handleEnterOrFocus(e: MouseEvent | FocusEvent) {
    floatingActionButton.style.backgroundColor = color;
    floatingActionButton.style.borderColor = color;
    toggleTitle(title, color);
  }

  function handleLeaveOrBlur(e: MouseEvent | FocusEvent) {
    floatingActionButton.style.backgroundColor = "transparent";
    floatingActionButton.style.borderColor = "var(--color-text)";
    toggleTitle();
  }
</script>

<div
  bind:this={floatingActionButton}
  class="floating-action-button hoverable flex-center"
  class:first
  class:last
  on:mouseenter={handleEnterOrFocus}
  on:focus={handleEnterOrFocus}
  on:mouseleave={handleLeaveOrBlur}
  on:blur={handleLeaveOrBlur}
  on:click={handleClick}
>
  <img class="is-svg" src={imagePath} alt={title} />
</div>

<style lang="scss">
  .floating-action-button {
    $border-radius: 4px;

    height: 36px;
    width: 48px;
    background-color: transparent;
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

    &:hover img {
      filter: var(--filter-light);
    }
  }
</style>
