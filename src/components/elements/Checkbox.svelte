<script lang="ts">
  export let label: string;

  // only need one or the other, not both
  export let checked = undefined;
  export let checkable: {
    checked: boolean;
  } = undefined;
</script>

<div class="checkbox">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label>
    {#if checkable}
      <input type="checkbox" bind:checked={checkable.checked} />
    {:else}
      <input type="checkbox" bind:checked />
    {/if}
    {label}
  </label>
</div>

<style lang="scss">
  .checkbox {
    white-space: nowrap;

    input:hover,
    label:hover {
      cursor: pointer;
    }
  }
</style>
