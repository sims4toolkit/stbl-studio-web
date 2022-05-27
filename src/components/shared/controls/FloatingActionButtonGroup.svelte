<script lang="ts">
  import { fly } from "svelte/transition";
  import { Settings } from "../../../typescript/storage";
  import FloatingActionButton from "./FloatingActionButton.svelte";

  export let disabled = false;
  export let disabledText = "disabled";

  export let buttonData: {
    color: string;
    title: string;
    icon: string;
    onClick(): void;
  }[];

  let titleText: string;
  let titleColor: string;
  $: showTitle = Boolean(titleText);

  function toggleTitle(text?: string, color?: string) {
    titleText = text;
    titleColor = color;
  }

  function handleEnterOrFocus(e: MouseEvent | FocusEvent) {
    if (disabled) toggleTitle(disabledText, "var(--color-text)");
  }

  function handleLeaveOrBlur(e: MouseEvent | FocusEvent) {
    if (disabled) toggleTitle();
  }
</script>

<div class="floating-action-buttons" class:disabled>
  {#if showTitle}
    <div
      class="title-container"
      style="background-color: {titleColor};"
      in:fly={{ y: 12, duration: Settings.reduceMotion ? 0 : 350 }}
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
        first={key === 0}
        last={key === buttonData.length - 1}
        color={data.color}
        title={data.title}
        icon={data.icon}
        handleClick={data.onClick}
        {disabled}
        {toggleTitle}
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
    }

    &.disabled {
      opacity: 0.55;

      .title-container {
        color: var(--color-bg);
      }
    }

    .buttons-row {
      display: flex;
    }
  }
</style>
