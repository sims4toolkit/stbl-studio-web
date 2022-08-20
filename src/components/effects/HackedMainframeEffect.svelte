<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let spawningInterval: any;
  let hackedMainframeOverlay: HTMLDivElement;
  const allNodes = new Set<HTMLParagraphElement>();
  let recycledNodes: {
    element: HTMLParagraphElement;
    speed: number;
  }[] = [];

  function createBinaryElement(seed: number) {
    let element: HTMLParagraphElement;
    let speed: number;

    if (recycledNodes.length > 0) {
      const recycled = recycledNodes.shift();
      element = recycled.element;
      speed = recycled.speed;
      element.style.left = `${Math.random() * window.innerWidth}px`;
      element.style.transition = `top ${speed}ms`;
      element.style.transitionTimingFunction = "linear";
      element.hidden = false;
    } else {
      element = document.createElement("p");
      allNodes.add(element);
      element.classList.add("fixed", "monospace");
      element.innerText = (seed % 2).toString();
      element.style.left = `${Math.random() * window.innerWidth}px`;
      const speedAndSizeRandom = Math.random();
      speed = Math.round(800 + (1 - speedAndSizeRandom) * 2200);
      element.style.fontSize =
        Math.round(6 + speedAndSizeRandom * 8) * 2 + "px";
      element.style.transition = `top ${speed}ms`;
      element.style.transitionTimingFunction = "linear";
      element.style.top = `-${element.style.fontSize}`;
      hackedMainframeOverlay.appendChild(element);
    }

    setTimeout(() => {
      element.style.top = window.innerHeight + "px";
      setTimeout(() => {
        element.hidden = true;
        element.style.transition = "none";
        element.style.top = `-${element.style.fontSize}`;
        recycledNodes.push({ element, speed });
      }, speed + 50);
    }, 50);
  }

  onMount(() => {
    spawningInterval = setInterval(() => {
      for (let i = 0; i < 5; ++i) createBinaryElement(i);
    }, 200);
  });

  onDestroy(() => {
    clearInterval(spawningInterval);
  });
</script>

<div
  class="fixed top-0 right-0 bottom-0 left-0 pointer-events-none opacity-10 z-50"
  bind:this={hackedMainframeOverlay}
/>
