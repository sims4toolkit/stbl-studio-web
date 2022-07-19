<script lang="ts">
  export let disabled = false;
  export let label: string = undefined;
  export let name: string;
  export let selected: number | bigint;
  export let fillWidth = false;
  export let options: {
    value: number | bigint;
    text: string;
  }[];
</script>

<div class="select-with-label" class:disabled class:w-100={fillWidth}>
  {#if Boolean(label)}
    <label class="small-title" for={name}>{label}</label>
  {/if}
  <select
    {name}
    id={name}
    bind:value={selected}
    class:mt-half={Boolean(label)}
    class:w-100={fillWidth}
    {disabled}
  >
    {#each options as option, key (key)}
      <option value={option.value}>
        {option.text}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  .select-with-label {
    &.disabled {
      user-select: none;
      pointer-events: none;
      opacity: 0.5;
    }

    select {
      height: 42px;
      // TODO: Fixes appearance on safari
      // -webkit-appearance: none;

      option {
        background-color: var(--color-bg);
      }
    }

    label,
    select {
      display: block;
    }
  }
</style>
