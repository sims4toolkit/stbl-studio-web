<script lang="ts">
  export let text: string;
  export let direction: "left" | "right" = "right";
  export let active = true;
  export let onClick: () => void;

  $: alt = direction === "left" ? "<" : ">";

  function handleClick() {
    if (active) onClick();
  }
</script>

<div class="inline-block">
  <button
    class="flex items-center select-none whitespace-nowrap"
    class:flex-row-reverse={direction === "right"}
    class:active
    on:click={handleClick}
  >
    <img class="svg" src="./assets/chevron-{direction}.svg" {alt} />
    <p class="my-0">{text}</p>
  </button>
</div>

<style lang="scss">
  button {
    &:not(.active),
    &.active:hover {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &.active:hover {
      cursor: pointer;
    }
  }
</style>
