<script lang="ts">
  export let disabled = false;
  export let label: string = null;
  export let name: string;
  export let fillWidth = false;
  export let selected: number | bigint;
  export let options: {
    value: number | bigint;
    text: string;
  }[];
</script>

<div class:w-full={fillWidth}>
  {#if Boolean(label)}
    <!-- Not using a label because it doesn't match input -->
    <p class="text-subtle uppercase text-xs font-bold mb-2">{label}</p>
  {/if}
  <select
    {name}
    bind:value={selected}
    class="block h-10 px-2 rounded text-sm bg-transparent border border-gray-700 dark:border-gray-300"
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
