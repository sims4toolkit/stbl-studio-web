<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import Settings from "src/lib/services/settings";
  import { subscribeToKey } from "src/lib/utilities/keybindings";

  export let onClose: () => void;

  let overlay: HTMLDivElement;
  let firstFocusableChild: Element;
  let lastFocusableChild: Element;

  const bodyClassName = "overlay-active";
  const focusQuery = "a, button, input, textarea, select";
  const subscriptions = [subscribeToKey("Escape", onClose)];

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
    subscriptions.forEach((unsub) => unsub());
  });

  function resetChildrenRefs() {
    const focusableChildren = overlay.querySelectorAll(focusQuery);
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
    if (!overlay.contains(e.relatedTarget)) {
      if (lastFocusableChild === e.target) {
        focusOnFirstChild();
      } else if (firstFocusableChild === e.target) {
        focusOnLastChild();
      }
    }
  }

  function onFocusIn(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!overlay.contains(e.target)) focusOnFirstChild();
  }
</script>

<div
  bind:this={overlay}
  in:fade={{ duration: Settings.reduceMotion ? 0 : 350 }}
  out:fade={{ duration: Settings.reduceMotion ? 0 : 200 }}
  class="fixed top-0 right-0 bottom-0 left-0 z-40 bg-gray-400 bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60"
>
  <slot />
</div>
