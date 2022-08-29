<script lang="ts">
  export let disabled = false;
  export let label: string = null;
  export let name: string;
  export let fillWidth = false;
  export let alignRight = false;
  export let selected: number | bigint | string;
  export let options: {
    value: number | bigint | string;
    text: string;
  }[];
</script>

<div
  class:w-full={fillWidth}
  class="flex flex-col"
  class:items-end={alignRight}
>
  {#if Boolean(label)}
    <!-- Not using a label because it doesn't match input -->
    <p class="text-subtle uppercase text-xs font-bold mb-2">{label}</p>
  {/if}
  <select
    {name}
    bind:value={selected}
    class="block h-10 pl-2 pr-8 rounded text-sm bg-transparent border border-gray-700 dark:border-gray-300"
    class:w-full={fillWidth}
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
  select:disabled {
    opacity: 0.6;

    &:hover {
      cursor: not-allowed;
    }
  }
</style>
