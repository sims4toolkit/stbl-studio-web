<script lang="ts">
  import { fly } from "svelte/transition";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import { Settings } from "../../../typescript/storage";
  import FloatingActionButton from "./FloatingActionButton.svelte";

  export let disabled = false;
  export let disabledTitle = "disabled";
  export let buttonData: {
    color: string;
    title: string;
    icon: string;
    disabled?: boolean;
    disabledTitle?: string;
    onClick(): void;
  }[];

  let titleText: string;
  let titleColor: string;
  let useDisabledColor: boolean;
  $: showTitle = Boolean(titleText);

  function toggleTitle(text?: string, color?: string) {
    titleText = text;
    titleColor = color;
    useDisabledColor = color === ToolbarColor.Disabled;
  }

  function childrenToggleTitle(text?: string, color?: string) {
    if (!disabled) toggleTitle(text, color);
  }

  function handleEnterOrFocus(e: MouseEvent | FocusEvent) {
    if (disabled) toggleTitle(disabledTitle, ToolbarColor.Disabled);
  }

  function handleLeaveOrBlur(e: MouseEvent | FocusEvent) {
    if (disabled) toggleTitle();
  }
</script>

<div class="floating-action-buttons">
  {#if showTitle}
    <div
      class="title-container"
      class:disabled-color={useDisabledColor}
      style="background-color: {titleColor};"
      transition:fly={{ y: 12, duration: Settings.reduceMotion ? 0 : 350 }}
    >
      {titleText}
    </div>
  {/if}
  <div
    class="buttons-row"
    on:mouseenter={handleEnterOrFocus}
    on:focus={handleEnterOrFocus}
    on:mouseleave={handleLeaveOrBlur}
    on:blur={handleLeaveOrBlur}
  >
    {#each buttonData as data, key (key)}
      <FloatingActionButton
        color={data.color}
        title={data.title}
        icon={data.icon}
        handleClick={data.onClick}
        disabled={disabled || data.disabled}
        disabledTitle={data.disabledTitle}
        toggleTitle={childrenToggleTitle}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .floating-action-buttons {
    position: fixed;
    bottom: 25px;
    right: 25px;

    .title-container {
      margin-bottom: 8px;
      border-radius: 4px;
      text-align: center;
      text-transform: uppercase;
      font-size: 0.85em;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
      color: var(--color-light);

      &.disabled-color {
        color: var(--color-bg);
      }
    }

    .buttons-row {
      display: flex;
    }
  }
</style>
