<script lang="ts">
  import { fade } from "svelte/transition";

  export let accept: string;
  export let files: FileList = undefined;
  export let label = "";
  export let multiple = false;
  export let filesInvalid = false;
  export let errorMessage = "";
</script>

<div>
  {#if Boolean(label)}
    <div class="flex-center-v">
      <label for="file-upload" class="small-title">{label}</label>
      {#if filesInvalid}
        <p in:fade class="subtle-text error-color my-0 ml-half">
          • {errorMessage}
        </p>
      {/if}
    </div>
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
