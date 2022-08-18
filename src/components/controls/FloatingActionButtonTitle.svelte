<script lang="ts">
  import { fly } from "svelte/transition";
  import Settings from "src/lib/services/settings";
  import { FloatingActionButtonColor } from "./types";

  export let text: string;
  export let color: string;
  export let disabled = false;

  let titleElement: HTMLDivElement;

  $: useDisabledColor = disabled || !color;

  $: {
    if (titleElement) {
      if (useDisabledColor) {
        titleElement.removeAttribute("style");
      } else {
        const colorToUse = Settings.disableToolbarColors
          ? "var(--color-toolbar-fallback)"
          : FloatingActionButtonColor[color];

        titleElement.style.backgroundColor = colorToUse;
      }
    }
  }
</script>

<div
  bind:this={titleElement}
  class="mb-2 text-center text-sm uppercase py-1 text-white"
  class:bg-gray-400={useDisabledColor}
  class:dark:bg-gray-600={useDisabledColor}
  transition:fly={{ y: 12, duration: Settings.reduceMotion ? 0 : 350 }}
>
  {text}
</div>

<style lang="scss">
  div {
    border-radius: 4px;
    transition: background-color 200ms;
    transition-delay: 0ms;
  }
</style>
