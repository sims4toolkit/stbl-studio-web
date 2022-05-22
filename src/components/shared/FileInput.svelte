<script lang="ts">
  import { fly } from "svelte/transition";

  export let accept: string;
  export let files: FileList = undefined;
  export let label = "";
  export let multiple = false;
  export let filesInvalid = false;
  export let errorMessage = "";
</script>

<div>
  {#if Boolean(label)}
    <label for="file-upload" class="small-title">{label}</label>
  {/if}
  <input
    id="file-upload"
    name="file-upload"
    type="file"
    class:invalid={filesInvalid}
    class="w-100 mt-half"
    {accept}
    {multiple}
    bind:files
  />
  {#if filesInvalid}
    <p in:fly={{ y: -20, duration: 800 }} class="subtle-text error-color mb-0">
      {errorMessage}
    </p>
  {/if}
</div>

<style lang="scss">
  input[type="file"] {
    &:hover {
      cursor: pointer;
    }

    &::file-selector-button {
      display: none;
    }

    &.invalid {
      border-color: var(--color-error);
    }
  }
</style>
