<script lang="ts">
  import { fade } from "svelte/transition";

  export let accept: string;
  export let files: FileList = undefined;
  export let label = "";
  export let multiple = false;
  export let errorMessage = "";

  $: filesInvalid = Boolean(errorMessage);
</script>

<div>
  {#if Boolean(label)}
    <div class="flex items-center mb-2">
      <label for="file-upload" class="text-subtle uppercase font-bold text-sm"
        >{label}</label
      >
      {#if filesInvalid}
        <p in:fade class="text-sm text-red-600 dark:text-red-400 my-0 ml-2">
          • {errorMessage}
        </p>
      {/if}
    </div>
  {/if}
  <input
    name="file-upload"
    type="file"
    class="w-full border h-10 p-2 rounded hover:cursor-pointer"
    class:border-red-600={filesInvalid}
    class:dark:border-red-400={filesInvalid}
    {accept}
    {multiple}
    bind:files
  />
</div>

<style lang="scss">
  input::file-selector-button {
    display: none;
  }
</style>
