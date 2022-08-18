<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { numMovableWindowsStore } from "src/lib/services/stores";

  export let title: string;
  export let onClose: () => void;

  let movableWindow: HTMLDivElement;
  let movableWindowHeader: HTMLDivElement;
  let numWindows = 0;

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
</script>

<div
  bind:this={movableWindow}
  class="z-30 movable-window rounded drop-shadow border border-solid border-gray-500 dark:border-gray-900 bg-gray-200 dark:bg-gray-700"
>
  <div
    bind:this={movableWindowHeader}
    class="movable-window-header rounded-t-sm flex justify-between items-center p-2 grabbable bg-gray-500 dark:bg-gray-900"
  >
    <div class="flex justify-center items-center gap-2">
      <p
        class="my-0 text-sm uppercase font-bold text-gray-200 dark:text-gray-400"
      >
        {title}
      </p>
    </div>
    <button on:click={onClose}>
      <img src="./assets/x.svg" class="svg-light" alt="Close" />
    </button>
  </div>
  <div class="p-2 window-content">
    <slot />
  </div>
</div>

<style lang="scss">
  .movable-window {
    $height: 400px;
    position: fixed;
    width: 360px;
    height: $height;
    right: 20px;
    bottom: 20px;

    .window-content {
      overflow-y: auto;
      max-width: 100%;
      overflow-x: hidden;
      max-height: $height - 40;
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