<script lang="ts">
  import { onMount } from "svelte";

  export let value: string = "";
  export let placeholder = "";
  export let fillWidth = false;
  export let focusOnMount = false;
  export let onEnter: () => void = null;

  let textarea: HTMLTextAreaElement;

  function onInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (!event.shiftKey && onEnter) {
        event.preventDefault();
        onEnter();
      }
    }
  }

  onMount(() => {
    textarea.setAttribute("style", "height:" + textarea.scrollHeight + "px;");
    onInput.call(textarea);
    if (focusOnMount) textarea.focus();
  });
</script>

<textarea
  bind:this={textarea}
  bind:value
  {placeholder}
  rows="1"
  class="w-full whitespace-pre-wrap break-words rounded p-2 resize-none overflow-x-hidden overflow-y-hidden bg-gray-75 dark:bg-gray-675 placeholder-gray-500 dark:placeholder-gray-500"
  class:w-100={fillWidth}
  on:input={onInput}
  on:keydown={onKeyDown}
/>
