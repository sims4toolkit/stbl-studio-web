<script lang="ts">
  import { onDestroy } from "svelte";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import { subscribeToKey } from "../../../typescript/keybindings";

  export let color: string;
  export let title: string;
  export let icon: string;
  export let disabled = false;
  export let keybinding: string = null;
  export let toggleTitle: (text?: string, color?: string) => void;
  export let handleClick: () => void;

  let floatingActionButton: HTMLButtonElement;
  let currentKeybinding: string = null;
  let unsubscribeKey: () => void = null;

  $: {
    keybinding;
    updateKeybinding();
  }

  onDestroy(() => {
    unsubscribeKey?.();
  });

  function updateKeybinding() {
    if (currentKeybinding !== keybinding) {
      unsubscribeKey?.();

      unsubscribeKey = keybinding
        ? subscribeToKey(keybinding, onButtonClick, {
            ctrlOrMeta: true,
            preventDefault: true,
          })
        : null;

      currentKeybinding = keybinding;
    }
  }

  function handleEnterOrFocus(e: MouseEvent | FocusEvent) {
    if (disabled) {
      toggleTitle(title, ToolbarColor.Disabled);
    } else {
      floatingActionButton.style.backgroundColor = color;
      floatingActionButton.style.borderColor = color;
      toggleTitle(title, color);
    }
  }

  function handleLeaveOrBlur(e: MouseEvent | FocusEvent) {
    floatingActionButton.style.backgroundColor = "var(--color-bg)";
    floatingActionButton.style.borderColor = "var(--color-text)";
    toggleTitle();
  }

  function onButtonClick() {
    if (!disabled) {
      floatingActionButton.blur();
      handleClick();
    }
  }
</script>

<button
  bind:this={floatingActionButton}
  class="floating-action-button flex-center"
  class:disabled
  on:mouseenter={handleEnterOrFocus}
  on:focus={handleEnterOrFocus}
  on:mouseleave={handleLeaveOrBlur}
  on:blur={handleLeaveOrBlur}
  on:click={onButtonClick}
>
  <img class="is-svg" src="./assets/{icon}.svg" alt={title} />
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
  }
</style>
