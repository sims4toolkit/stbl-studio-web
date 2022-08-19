<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let spawningInterval: any;
  let hackedMainframeOverlay: HTMLDivElement;

  function createBinaryElement() {
    const element = document.createElement("p");
    element.classList.add("fixed", "monospace");
    element.innerText = Math.random() < 0.5 ? "1" : "0";
    element.style.left = `${Math.random() * window.innerWidth}px`;

    const speedAndSizeRandom = Math.random();
    const speed = Math.round(1000 + (1 - speedAndSizeRandom) * 2500);
    element.style.fontSize = Math.round(12 + speedAndSizeRandom * 12) + "px";
    element.style.transition = `top ${speed}ms`;
    element.style.transitionTimingFunction = "linear";

    element.style.top = "-20px";
    hackedMainframeOverlay.appendChild(element);
    setTimeout(() => {
      element.style.top = window.innerHeight + "px";
      setTimeout(() => {
        hackedMainframeOverlay?.removeChild(element);
      }, speed + 50);
    }, 50);
  }

  onMount(() => {
    spawningInterval = setInterval(createBinaryElement, 75);
  });

  onDestroy(() => {
    clearInterval(spawningInterval);
  });
</script>

<div
  class="fixed top-0 right-0 bottom-0 left-0 pointer-events-none opacity-10 z-50"
  bind:this={hackedMainframeOverlay}
/>
