<script lang="ts">
  export let label: string;

  export let checkable: {
    checked: boolean;
  };
</script>

<div class="checkbox">
  <label>
    <input type="checkbox" bind:checked={checkable.checked} />
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
