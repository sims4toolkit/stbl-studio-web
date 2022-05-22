<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  export let fill: boolean = true;

  let modal: HTMLDivElement;
  let firstFocusableChild: Element;

  const bodyClassName = "blur-effect-active";

  onMount(() => {
    document.body.classList.add(bodyClassName);

    firstFocusableChild = modal.querySelector(
      "a, button, input, textarea, select"
    );

    window.addEventListener("focusin", focusBlocker);
  });

  onDestroy(() => {
    document.body.classList.remove(bodyClassName);
    window.removeEventListener("focusin", focusBlocker);
  });

  function focusBlocker(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!modal.contains(e.target)) {
      if (!document.contains(firstFocusableChild)) {
        firstFocusableChild = modal.querySelector(
          "a, button, input, textarea, select"
        );
      }

      try {
        //@ts-ignore I do know why it's being annoying about this one...
        firstFocusableChild?.focus();
      } catch (e) {}
    }
  }
</script>

<div bind:this={modal} class="overlay" transition:fade>
  <div class="popup" class:fill>
    <div class="overlay-content-wrapper">
      <slot name="content" />
    </div>
    <slot name="actions" />
  </div>
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
      $max-width: 768px;

      max-width: $max-width;
      padding: 1em;

      &.fill {
        width: $max-width;
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
