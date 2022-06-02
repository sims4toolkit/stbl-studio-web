<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let accept: string;
  export let files: FileList = undefined;
  export let label = "";
  export let multiple = false;
  export let filesInvalid = false;
  export let errorMessage = "";
  export let focusOnMount = false;

  let fileInput: HTMLInputElement;

  onMount(() => {
    if (focusOnMount) {
      fileInput.focus();
    }
  });
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
    bind:this={fileInput}
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
