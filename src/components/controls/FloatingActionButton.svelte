<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "src/lib/utilities/keybindings";
  import type { FloatingActionButtonData } from "./types";
  import { FloatingActionButtonColor } from "./types";

  export let data: FloatingActionButtonData;
  export let toggleTitle: (text?: string, color?: string) => void;

  let floatingActionButton: HTMLButtonElement;
  let currentKeybinding: string = null;
  let unsubscribeKey: () => void = null;

  $: {
    data.keybinding;
    updateKeybinding();
  }

  onDestroy(() => {
    unsubscribeKey?.();
  });

  function updateKeybinding() {
    if (currentKeybinding !== data.keybinding) {
      unsubscribeKey?.();

      unsubscribeKey = data.keybinding
        ? subscribeToKey(data.keybinding, onButtonClick, {
            ctrlOrMeta: true,
            preventDefault: true,
          })
        : null;

      currentKeybinding = data.keybinding;
    }
  }

  function handleEnterOrFocus(e: MouseEvent | FocusEvent) {
    if (data.disabled) {
      toggleTitle(data.title, "");
    } else {
      const color = FloatingActionButtonColor[data.color];
      floatingActionButton.style.backgroundColor = color;
      floatingActionButton.style.borderColor = color;
      toggleTitle(data.title, data.color);
    }
  }

  function handleLeaveOrBlur(e: MouseEvent | FocusEvent) {
    floatingActionButton.style.backgroundColor = "var(--color-bg)";
    floatingActionButton.style.borderColor = "var(--color-text)";
    toggleTitle();
  }

  function onButtonClick() {
    if (!data.disabled) {
      floatingActionButton.blur();
      data.onClick();
    }
  }
</script>

<button
  bind:this={floatingActionButton}
  class="floating-action-button flex justify-center items-center"
  class:disabled={data.disabled}
  on:mouseenter={handleEnterOrFocus}
  on:focus={handleEnterOrFocus}
  on:mouseleave={handleLeaveOrBlur}
  on:blur={handleLeaveOrBlur}
  on:click={onButtonClick}
>
  <img class="svg" src="./assets/{data.icon}.svg" alt={data.title} />
</button>

<style lang="scss">
  .floating-action-button {
    $border-radius: 4px;

    height: 36px;
    width: 48px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-text);

    &:first-child {
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }

    &:last-child {
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }

    &.disabled {
      opacity: 0.5;

      &:hover {
        cursor: not-allowed;
      }
    }

    &:not(.disabled):hover,
    &:not(.disabled):focus {
      cursor: pointer;

      img {
        filter: var(--filter-light);
      }
    }

    img {
      height: 24px;
    }
  }
</style>
