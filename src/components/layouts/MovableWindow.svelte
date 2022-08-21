<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { numMovableWindowsStore } from "src/lib/services/stores";
  import Settings from "src/lib/services/settings";

  export let title: string;
  export let onClose: () => void;

  let movableWindow: HTMLDivElement;
  let movableWindowHeader: HTMLDivElement;
  let numWindows = 0;
  let isMinimized = false;

  const unsub = numMovableWindowsStore.subscribe((numWindowsOpen) => {
    numWindows = numWindowsOpen;
  });

  function enableDragging() {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    movableWindowHeader.onmousedown = dragMouseDown;

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      movableWindow.style.top = movableWindow.offsetTop - pos2 + "px";
      movableWindow.style.left = movableWindow.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      if (movableWindow.offsetTop < 0) movableWindow.style.top = "10px";
      else if (
        movableWindow.offsetTop >
        window.innerHeight - movableWindow.offsetHeight - 10
      )
        movableWindow.style.top =
          window.innerHeight - movableWindow.offsetHeight - 10 + "px";

      if (movableWindow.offsetLeft < 0) movableWindow.style.left = "10px";
      else if (
        movableWindow.offsetLeft >
        window.innerWidth - movableWindow.offsetWidth - 10
      )
        movableWindow.style.left =
          window.innerWidth - movableWindow.offsetWidth - 10 + "px";
    }
  }

  onMount(() => {
    enableDragging();

    if (numWindows > 0) {
      const offset = 20 + 40 * numWindows;
      movableWindow.style.right = offset + "px";
      movableWindow.style.zIndex = (30 + numWindows).toString();
    }

    numMovableWindowsStore.set(numWindows + 1);
  });

  onDestroy(() => {
    unsub();
    numMovableWindowsStore.set(numWindows - 1);
  });

  function toggleMinimized() {
    if (movableWindow.offsetTop > window.innerHeight - 200) {
      // anchor to bottom
      const bottom = movableWindow.offsetTop + movableWindow.offsetHeight;
      movableWindow.style.bottom = window.innerHeight - bottom + "px";
      movableWindow.style.removeProperty("top");
    }

    isMinimized = !isMinimized;
  }
</script>

<div
  bind:this={movableWindow}
  class="flex flex-col z-30 movable-window rounded drop-shadow border border-solid border-gray-500 dark:border-gray-900 bg-gray-200 dark:bg-gray-700 hacker-bg-black"
  class:minimized={isMinimized}
  in:fly={{ x: 35, duration: Settings.reduceMotion ? 0 : 350 }}
  out:fade={{ duration: Settings.reduceMotion ? 0 : 200 }}
>
  <div
    bind:this={movableWindowHeader}
    class="movable-window-header z-10 rounded-t-sm flex justify-between items-center p-2 grabbable bg-gray-500 dark:bg-gray-900 hacker-bg-black hacker-border-b-gray"
  >
    <div class="flex justify-center items-center gap-2">
      <p
        class="my-0 text-sm uppercase font-bold text-gray-200 dark:text-gray-400 hacker-text-lime"
      >
        {title}
      </p>
    </div>
    <div class="flex gap-2">
      <button on:click={toggleMinimized}>
        <img
          src="./assets/{isMinimized ? 'plus' : 'remove'}.svg"
          class="svg-light hacker-svg"
          alt="Minimize"
        />
      </button>
      <button on:click={onClose}>
        <img src="./assets/x.svg" class="svg-light hacker-svg" alt="Close" />
      </button>
    </div>
  </div>
  <div
    class="p-2 z-0 window-content flex flex-col flex-1 bg-gray-200 dark:bg-gray-700 hacker-bg-black"
    class:minimized={isMinimized}
  >
    <slot />
  </div>
</div>

<style lang="scss">
  .movable-window {
    $height: 400px;
    $transition-time: 500ms;

    position: fixed;
    width: 360px;
    height: $height;
    right: 20px;
    bottom: 20px;
    overflow-y: hidden;

    transition: height $transition-time;
    &.minimized {
      height: 38px;
    }

    .window-content {
      overflow-y: auto;
      max-width: 100%;
      overflow-x: hidden;
      max-height: $height - 40;

      margin-top: 0;
      transition: all $transition-time;
      &.minimized {
        overflow-y: hidden;
        margin-top: -400px;
      }
    }

    .movable-window-header {
      img {
        height: 1em;
      }
    }
  }

  .grabbable {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }

  /* (Optional) Apply a "closed-hand" cursor during drag operation. */
  .grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }
</style>
