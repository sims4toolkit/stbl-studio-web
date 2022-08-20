<script lang="ts">
  import { onMount } from "svelte";

  export let refresher: any = null; // for refreshing
  export let value: string = "";
  export let placeholder = "";
  export let onFocus: (e: FocusEvent) => void = () => {};
  export let onBlur: (e: FocusEvent) => void = () => {};
  export let disabled = false;
  export let textarea: HTMLTextAreaElement = null;
  export let fillWidth = false;
  export let focusOnMount = false;

  function onInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  $: {
    if (textarea && refresher != null) {
      delete textarea.style.height;
      onInput.call(textarea);
    }
  }

  onMount(() => {
    textarea.setAttribute("style", "height:" + textarea.scrollHeight + "px;");
    textarea.addEventListener("input", onInput, false);
    onInput.call(textarea);
    if (focusOnMount) textarea.focus();
  });
</script>

<textarea
  bind:this={textarea}
  bind:value
  {placeholder}
  {disabled}
  rows="1"
  class="w-full whitespace-pre-wrap break-words rounded p-2 resize-none overflow-x-hidden overflow-y-hidden bg-gray-75 dark:bg-gray-675 placeholder-gray-500 dark:placeholder-gray-500"
  class:w-100={fillWidth}
  on:focus={onFocus}
  on:blur={onBlur}
/>
