<script lang="ts">
  export let value: number;
  export let onClick: (value: number) => void;

  function handleClick() {
    onClick(value);
  }
</script>

{#if Boolean(value)}
  <button on:click={handleClick}>
    {value}
  </button>
{/if}

<style lang="scss">
  button {
    background-color: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-divider);
    border-radius: 4px;
    padding: {
      left: 8px;
      right: 8px;
      top: 4px;
      bottom: 4px;
    }

    &:hover {
      background-color: var(--color-accent);
      color: var(--color-bg);
      border-color: var(--color-accent);
      cursor: pointer;
    }
  }
</style>
