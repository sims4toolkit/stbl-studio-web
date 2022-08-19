<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let spawningInterval: any;
  let movingIntervals: Set<any> = new Set();
  let hackedMainframeOverlay: HTMLDivElement;

  function createBinaryElement(): HTMLParagraphElement {
    const element = document.createElement("p");
    element.classList.add("fixed", "monospace");
    element.innerText = Math.random() < 0.5 ? "01" : "10";
    element.style.left = `${Math.random() * window.innerWidth}px`;
    element.style.top = "0";
    element.style.fontSize = Math.round(10 + Math.random() * 8) + "px";

    let y = 0;
    const increment = Math.round(10 + Math.random() * 15);
    let movingInterval = setInterval(() => {
      if (y > window.innerHeight) {
        clearInterval(movingInterval);
        movingIntervals.delete(movingInterval);
        hackedMainframeOverlay.removeChild(element);
      } else {
        y += increment;
        element.style.top = y + "px";
      }
    }, 85);
    movingIntervals.add(movingInterval);

    return element;
  }

  onMount(() => {
    spawningInterval = setInterval(() => {
      const element = createBinaryElement();
      hackedMainframeOverlay.appendChild(element);
    }, 175);
  });

  onDestroy(() => {
    clearInterval(spawningInterval);
    movingIntervals.forEach((i) => {
      clearInterval(i);
    });
  });
</script>

<div
  class="fixed top-0 right-0 bottom-0 left-0 pointer-events-none opacity-10 z-50"
  bind:this={hackedMainframeOverlay}
/>
