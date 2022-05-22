<script lang="ts">
  export let label: string;

  export let checkable: {
    checked: boolean;
  };
</script>

<label>
  <input type="checkbox" bind:checked={checkable.checked} />
  {label}
</label>

<style lang="scss">
  // intentionally blank
</style>
