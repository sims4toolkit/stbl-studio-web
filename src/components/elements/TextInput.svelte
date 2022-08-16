<script lang="ts">
  import { onMount } from "svelte";

  export let label: string = "";
  export let name: string;
  export let value: string;
  export let placeholder: string;
  export let isValid = true;
  export let fillWidth = false;
  export let focusOnMount = false;
  export let monospace = false;

  let input: HTMLInputElement;

  onMount(() => {
    if (focusOnMount) input.focus();
  });
</script>

<div class:w-full={fillWidth}>
  {#if Boolean(label)}
    <label
      class="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold"
      for={name}>{label}</label
    >
  {/if}
  <input
    bind:this={input}
    {name}
    bind:value
    {placeholder}
    type="text"
    autocomplete="off"
    class="block h-10 px-2 rounded text-sm placeholder-gray-500 dark:placeholder-gray-500 bg-transparent border border-gray-700 dark:border-gray-300"
    class:monospace
    class:mt-2={Boolean(label)}
    class:w-full={fillWidth}
    class:border-red-600={!isValid}
    class:dark:border-red-400={!isValid}
  />
</div>
