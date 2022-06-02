<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Settings } from "../../../typescript/storage";
  import GradientHeader from "../elements/GradientHeader.svelte";
  import NavigationButton from "../elements/NavigationButton.svelte";
  import ProgressCircles from "../controls/ProgressCircles.svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";

  const animationDuration = Settings.reduceMotion ? 0 : 850;

  export let title: string = null;
  export let subtitle: string = null;

  export let minimumContentHeight: string = null;
  export let centerVertically = false;

  export let canClickBack = true;
  export let showProgress = true;
  export let numPages = 1;
  export let completePages = 1;
  export let currentPage = 1;

  export let showNextButton = true;
  export let nextButtonText = "Next";
  export let finalPageNextButtonText = "Next";
  export let onNextButtonClick: () => void = () => {};

  $: canClickNext = completePages >= currentPage;

  let contentContainer: HTMLDivElement;

  const keySubscriptions = [
    subscribeToKey(
      "ArrowLeft",
      () => {
        if (canClickBack && currentPage > 1) currentPage--;
      },
      {
        preventDefault: true,
        ctrlOrMeta: true,
      }
    ),
    subscribeToKey(
      "ArrowRight",
      () => {
        if (canClickNext) onNextButtonClick();
      },
      {
        preventDefault: true,
        ctrlOrMeta: true,
      }
    ),
  ];

  onMount(() => {
    if (minimumContentHeight) {
      contentContainer.style.minHeight = minimumContentHeight + "px";
    }
  });

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  function onProgressCircleClick(index: number) {
    if (canClickBack) {
      currentPage = index + 1;
    }
  }
</script>

<div>
  <div in:fly={{ y: -15, duration: animationDuration }}>
    {#if title}
      <GradientHeader {title} />
      {#if subtitle}
        <p class="mt-1 mb-0 subtle-text">{subtitle}</p>
      {/if}
    {:else}
      <slot name="header" />
    {/if}
  </div>
  <div
    bind:this={contentContainer}
    class="my-2"
    class:flex-center-v={centerVertically}
    in:fly={{ y: 20, duration: animationDuration }}
  >
    <slot name="content" />
  </div>
  {#if showProgress || showNextButton}
    <div
      class:flex-space-between={showProgress}
      class:flex-end={!showProgress}
      in:fly={{ y: 35, duration: animationDuration }}
    >
      {#if showProgress}
        <ProgressCircles
          circles={numPages}
          filled={completePages}
          {currentPage}
          clickable={canClickBack ? completePages - 1 : 0}
          onClick={onProgressCircleClick}
        />
      {/if}
      {#if showNextButton}
        <NavigationButton
          direction="right"
          active={canClickNext}
          text={currentPage === numPages
            ? finalPageNextButtonText
            : nextButtonText}
          onClick={onNextButtonClick}
        />
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  // intentionally blank
</style>
