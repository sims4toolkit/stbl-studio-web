<script lang="ts">
  export let disabled = false;
  export let label: string = null;
  export let name: string;
  export let fillWidth = false;
  export let alignRight = false;
  export let selected: number | bigint | string;

  // only need one or the other
  export let options: Option[] = null;
  export let optionGroups: {
    name: string;
    options: Option[];
  }[] = null;

  interface Option {
    value: number | bigint | string;
    text: string;
  }
</script>

<div
  class:w-full={fillWidth}
  class="flex flex-col"
  class:sm:items-end={alignRight}
>
  {#if Boolean(label)}
    <!-- Not using a label because it doesn't match input -->
    <p class="text-subtle uppercase text-xs font-bold mb-2">{label}</p>
  {/if}
  <select
    {name}
    bind:value={selected}
    class="block h-10 pl-2 pr-8 rounded text-sm bg-transparent border border-gray-600 dark:border-gray-400"
    class:w-full={fillWidth}
    {disabled}
  >
    {#if Boolean(optionGroups)}
      {#each optionGroups as group, key (key)}
        <optgroup label={group.name}>
          {#each group.options as option, key (key)}
            <option value={option.value}>
              {option.text}
            </option>
          {/each}
        </optgroup>
      {/each}
    {:else}
      {#each options as option, key (key)}
        <option value={option.value}>
          {option.text}
        </option>
      {/each}
    {/if}
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
