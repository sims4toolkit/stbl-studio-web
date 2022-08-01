<script lang="ts">
  import { fly } from "svelte/transition";
  import { Settings } from "../../../typescript/storage";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";

  export let text: string;
  export let bgColor: string;

  $: useDisabledColor = bgColor === ToolbarColor.Disabled;
</script>

<div
  class="floating-action-button-title"
  class:disabled-color={useDisabledColor}
  style="background-color: {bgColor};"
  transition:fly={{ y: 12, duration: Settings.reduceMotion ? 0 : 350 }}
>
  {text}
</div>

<style lang="scss">
  .floating-action-button-title {
    margin-bottom: 8px;
    border-radius: 4px;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.85em;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    color: var(--color-light);

    transition: background-color 200ms;
    transition-delay: 0ms;

    &.disabled-color {
      color: var(--color-bg);
    }
  }
</style>
