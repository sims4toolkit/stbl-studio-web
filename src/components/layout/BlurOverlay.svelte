<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import StickyCloseButton from "../elements/StickyCloseButton.svelte";

  export let large = false;
  export let onClose: () => void = undefined;

  let modal: HTMLDivElement;
  let firstFocusableChild: Element;
  let lastFocusableChild: Element;

  const bodyClassName = "blur-effect-active";
  const focusQuery = "a, button, input, textarea, select";

  onMount(() => {
    document.body.classList.add(bodyClassName);
    resetChildrenRefs();
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
  });

  onDestroy(() => {
    document.body.classList.remove(bodyClassName);
    window.removeEventListener("focusin", onFocusIn);
    window.removeEventListener("focusout", onFocusOut);
  });

  function resetChildrenRefs() {
    const focusableChildren = modal.querySelectorAll(focusQuery);
    firstFocusableChild = focusableChildren[0];
    lastFocusableChild = focusableChildren[focusableChildren.length - 1];
  }

  function focusOnFirstChild() {
    if (!document.contains(firstFocusableChild)) resetChildrenRefs();
    //@ts-ignore I do know why it's being annoying about this one...
    firstFocusableChild?.focus();
  }

  function onFocusOut(e: FocusEvent) {
    if (lastFocusableChild === e.target) focusOnFirstChild();
  }

  function onFocusIn(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!modal.contains(e.target)) focusOnFirstChild();
  }
</script>

<div bind:this={modal} class="overlay" transition:fade>
  <div class="popup" class:large>
    <div class="overlay-content-wrapper">
      <slot name="content" />
    </div>
    <slot name="actions" />
  </div>
  {#if onClose != undefined}
    <StickyCloseButton onClick={onClose} />
  {/if}
</div>

<style lang="scss">
  .overlay {
    z-index: 2048;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-blur-fallback);

    .popup {
      max-width: 768px;
      padding: 1em;

      &.large {
        max-width: 1280px;
      }

      .overlay-content-wrapper {
        margin-bottom: 2.8em;
      }
    }
  }

  /* if backdrop support: very transparent and blurred */
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    .overlay {
      background-color: transparent;
      backdrop-filter: var(--filter-bg-blur);
      -webkit-backdrop-filter: var(--filter-bg-blur);
    }
  }
</style>
