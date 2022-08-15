<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { subscribeToKey } from "src/lib/utilities/keybindings";
  import Settings from "src/lib/services/settings";

  export let large = false;
  export let fill = true;
  export let onClose: () => void = undefined;

  let modal: HTMLDivElement;
  let firstFocusableChild: Element;
  let lastFocusableChild: Element;

  // this class is referenced in base.scss
  const bodyClassName = "overlay-active";
  const focusQuery = "a, button, input, textarea, select";
  const keySubscriptions = [];
  if (onClose != undefined)
    keySubscriptions.push(subscribeToKey("Escape", onClose));

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
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
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

  function focusOnLastChild() {
    if (!document.contains(lastFocusableChild)) resetChildrenRefs();
    //@ts-ignore I do know why it's being annoying about this one...
    lastFocusableChild?.focus();
  }

  function onFocusOut(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!modal.contains(e.relatedTarget)) {
      if (lastFocusableChild === e.target) {
        focusOnFirstChild();
      } else if (firstFocusableChild === e.target) {
        focusOnLastChild();
      }
    }
  }

  function onFocusIn(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!modal.contains(e.target)) focusOnFirstChild();
  }
</script>

<div
  bind:this={modal}
  class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-40 blurred-bg bg-gray-100 dark:bg-gray-800"
  transition:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
>
  <div
    class="p-4 max-w-screen-md"
    class:max-w-screen-xl={large}
    class:w-full={fill}
  >
    <div>
      <slot />
    </div>
  </div>
  {#if onClose != undefined}
    <button class="fixed top-6 right-6" on:click={onClose}>
      <img class="svg w-10 h-10" src="./assets/x.svg" alt="Close" />
    </button>
  {/if}
</div>
