<script lang="ts">
  export let text: string;
  export let direction: "left" | "right" = "left";
  export let active = true;
  export let onClick: () => void;

  function handleClick() {
    if (active) onClick();
  }
</script>

<div
  class="navigation-button unselectable-text flex-center-v"
  class:active
  on:click={handleClick}
>
  {#if direction === "left"}
    <img class="is-svg" src="./assets/chevron-left.svg" alt="<" />
  {/if}
  <p class="my-0">{text}</p>
  {#if direction === "right"}
    <img class="is-svg" src="./assets/chevron-right.svg" alt=">" />
  {/if}
</div>

<style lang="scss">
  .navigation-button {
    text-decoration: none;
    white-space: nowrap;
    color: var(--color-text);
    opacity: 1;

    &:not(.active),
    &.active:hover {
      opacity: 0.65;
    }

    &.active:hover {
      cursor: pointer;
    }
  }
</style>
