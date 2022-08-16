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
    <label
      class="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold"
      for={name}>{label}</label
    >
  {/if}
  <select
    {name}
    bind:value={selected}
    class="h-10 px-2 rounded text-sm bg-transparent border border-gray-700 dark:border-gray-300"
    class:mt-2={Boolean(label)}
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
