<script lang="ts">
  export let label: string = undefined;
  export let name: string;
  export let selected: number;
  export let options: {
    value: number;
    text: string;
  }[];
</script>

<div class="select-with-label my-1">
  {#if Boolean(label)}
    <label class="small-title" for={name}>{label}</label>
  {/if}
  <select {name} id={name} bind:value={selected} class="mt-half">
    {#each options as option, key (key)}
      <option value={option.value}>
        {option.text}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  .select-with-label {
    label,
    select {
      display: block;
    }
  }
</style>
