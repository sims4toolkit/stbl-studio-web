<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Settings from "src/lib/services/settings";
  import NavigationButton from "src/components/elements/NavigationButton.svelte";
  import type { MultipageContentState } from "./types";

  export let title: string = null;
  export let subtitle: string = null;
  export let minimumContentHeight: string = null;
  export let centerVertically = false;
  export let numPages: number;
  export let canClickBack = true;
  export let state: MultipageContentState;
  export let onLastPageComplete: () => void;

  const animationDuration = Settings.reduceMotion ? 0 : 850;
  let contentContainer: HTMLDivElement;
  let pageCounter = { length: numPages };

  onMount(() => {
    if (minimumContentHeight) {
      contentContainer.style.minHeight = minimumContentHeight + "px";
    }
  });

  function circleTransparent(index: number) {
    return index + 1 === state.currentPage && !state.nextButtonEnabled;
  }

  function circleFilledIn(index: number) {
    return index < state.currentPage;
  }

  function circleClickable(index: number) {
    return canClickBack && index + 1 < state.currentPage;
  }

  function onNextButtonClick() {
    if (!state.nextButtonEnabled) return;

    if (state.currentPage === numPages) {
      onLastPageComplete();
    } else {
      state.currentPage++;
      pageCounter = pageCounter;
    }
  }

  function onProgressCircleClick(index: number) {
    if (circleClickable(index)) {
      state.currentPage = index + 1;
      pageCounter = pageCounter;
    }
  }
</script>

<div>
  <div in:fly={{ y: -15, duration: animationDuration }}>
    {#if title}
      <h2 class="font-bold text-2xl mb-2 text-gradient drop-shadow">
        {title}
      </h2>
      {#if subtitle}
        <p class="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      {/if}
    {:else}
      <slot name="header" />
    {/if}
  </div>
  <div
    bind:this={contentContainer}
    class="my-8 flex"
    class:items-center={centerVertically}
    in:fly={{ y: 20, duration: animationDuration }}
  >
    <slot name="content" />
  </div>
  <div
    class="flex justify-between"
    in:fly={{ y: 35, duration: animationDuration }}
  >
    <div class="flex gap-2">
      {#each pageCounter as _, i (i)}
        <button
          class="progress-circle h-5 w-5 rounded-full border border-gray-500"
          class:clickable={circleClickable(i)}
          class:filled={circleFilledIn(i)}
          class:opacity-20={circleTransparent(i)}
          tabindex={circleClickable(i) ? 0 : -1}
          on:click={() => onProgressCircleClick(i)}
        />
      {/each}
    </div>
    <NavigationButton
      direction="right"
      active={state.nextButtonEnabled}
      text={state.nextButtonText}
      onClick={onNextButtonClick}
    />
  </div>
</div>

<style lang="scss">
  .progress-circle {
    cursor: default;

    &.filled {
      border: none;
      background-color: var(--color-accent);

      &.clickable:hover {
        cursor: pointer;
      }
    }
  }
</style>