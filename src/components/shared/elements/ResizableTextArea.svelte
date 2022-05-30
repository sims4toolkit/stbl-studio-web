<script lang="ts">
  import { onMount } from "svelte";

  export let refresher: any = null; // for refreshing
  export let value: string;
  export let placeholder = "";
  export let onFocus: (e: FocusEvent) => void = () => {};
  export let onBlur: (e: FocusEvent) => void = () => {};
  export let disabled = false;

  let textarea: HTMLTextAreaElement;

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
  });
</script>

<textarea
  bind:this={textarea}
  bind:value
  {placeholder}
  {disabled}
  rows="1"
  class="pre-wrap word-wrap"
  on:focus={onFocus}
  on:blur={onBlur}
/>

<style lang="scss">
  textarea {
    resize: none;
    background-color: var(--color-bg-secondary);
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;

    &:not(:focus) {
      border: 1px solid var(--color-bg-secondary);
    }
  }
</style>
