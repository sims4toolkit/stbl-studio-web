<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Settings } from "../../typescript/storage";
  import GradientHeader from "../elements/GradientHeader.svelte";
  import NavigationButton from "../elements/NavigationButton.svelte";
  import ProgressCircles from "../elements/ProgressCircles.svelte";

  const animationDuration = Settings.reduceMotion ? 0 : 850;

  export let title: string = null;
  export let subtitle: string = null;
  export let minimumContentHeight: string = null;
  export let showProgress = true;
  export let numPages = 1;
  export let completePages = 1;
  export let currentPage = 1;
  export let showNextButton = true;
  export let nextButtonText = "Next";
  export let finalPageNextButtonText = "Next";
  export let onNextButtonClick: () => void = () => {};

  let contentContainer: HTMLDivElement;

  onMount(() => {
    if (minimumContentHeight) {
      contentContainer.style.minHeight = minimumContentHeight + "px";
    }
  });
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
        <ProgressCircles circles={numPages} filled={completePages} />
      {/if}
      {#if showNextButton}
        <NavigationButton
          direction="right"
          active={completePages >= currentPage}
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
