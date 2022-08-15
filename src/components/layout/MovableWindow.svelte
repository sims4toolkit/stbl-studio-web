<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { numMovableWindowsStore } from "../../typescript/stores";

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
      let offset = 40 + movableWindow.offsetWidth;
      offset *= numWindows;
      if (window.innerWidth >= offset + 40 + movableWindow.offsetWidth)
        movableWindow.style.right = offset + "px";
      movableWindow.style.zIndex = (1024 + numWindows).toString();
    }

    numMovableWindowsStore.set(numWindows + 1);
  });

  onDestroy(() => {
    unsub();
    numMovableWindowsStore.set(numWindows - 1);
  });
</script>

<div bind:this={movableWindow} class="movable-window drop-shadow">
  <div
    bind:this={movableWindowHeader}
    class="movable-window-header flex-space-between flex-center-v p-half grabbable"
  >
    <div class="flex-center-v flex-gap-small">
      <p class="my-0 small-title unselectable-text">{title}</p>
      <p class="my-0 subtle-text">(Draggable)</p>
    </div>
    <button class="button-wrapper" on:click={onClose}>
      <img src="./assets/x.svg" class="is-svg" alt="Close" />
    </button>
  </div>
  <div class="p-half window-content">
    <slot />
  </div>
</div>

<style lang="scss">
  .movable-window {
    $height: 400px;
    z-index: 1024;
    position: fixed;
    width: 360px;
    height: $height;
    right: 20px;
    bottom: 20px;
    background-color: var(--color-card);
    border: 1px solid var(--color-bg-secondary);
    border-radius: 4px;

    .window-content {
      overflow-y: auto;
      max-width: 100%;
      overflow-x: hidden;
      max-height: $height - 40;
    }

    .movable-window-header {
      background-color: var(--color-card-secondary);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

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
