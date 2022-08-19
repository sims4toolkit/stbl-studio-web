<script lang="ts">
  import type { FloatingActionButtonData } from "./types";
  import FloatingActionButton from "./FloatingActionButton.svelte";
  import FloatingActionButtonTitle from "./FloatingActionButtonTitle.svelte";

  export let disabled = false;
  export let buttonData: FloatingActionButtonData[];

  let titleText: string;
  let titleColor: string;
  $: showTitle = Boolean(titleText);

  function toggleTitle(text?: string, color?: string) {
    titleText = text;
    titleColor = color;
  }
</script>

<div class="fixed right-6 bottom-6">
  {#if showTitle}
    <FloatingActionButtonTitle text={titleText} color={titleColor} {disabled} />
  {/if}
  <div class="flex">
    {#each buttonData as data, key (key)}
      <FloatingActionButton bind:data {toggleTitle} />
    {/each}
  </div>
</div>

<style lang="scss" global>
  :root {
    --toolbar-green: #68a768;
    --toolbar-cyan: #5391c7;
    --toolbar-azure: #4970c7;
    --toolbar-red: #c16262;
    --toolbar-pink: #c46db4;
    --toolbar-purple: #845bb5;
    --toolbar-orange: #d3975c;

    &.dark {
      --toolbar-hover-fg: white;
      --toolbar-hover-filter: var(--filter-light);
      --toolbar-disabled-fg: black;
      --toolbar-disabled-bg: gray;
    }

    &:not(.dark) {
      --toolbar-hover-fg: white;
      --toolbar-hover-filter: var(--filter-light);
      --toolbar-disabled-fg: white;
      --toolbar-disabled-bg: gray;
    }

    &[data-monochrome-toolbar="true"] {
      --toolbar-green: var(--color-accent-secondary);
      --toolbar-cyan: var(--color-accent-secondary);
      --toolbar-azure: var(--color-accent-secondary);
      --toolbar-red: var(--color-accent-secondary);
      --toolbar-pink: var(--color-accent-secondary);
      --toolbar-purple: var(--color-accent-secondary);
      --toolbar-orange: var(--color-accent-secondary);
      --toolbar-hover-fg: var(--color-bg);
      --toolbar-hover-filter: var(--filter-svg-invert);
      --toolbar-disabled-fg: black;
      --toolbar-disabled-bg: gray;
    }

    &[data-hacker-theme="true"] {
      --toolbar-green: lime;
      --toolbar-cyan: lime;
      --toolbar-azure: lime;
      --toolbar-red: lime;
      --toolbar-pink: lime;
      --toolbar-purple: lime;
      --toolbar-orange: lime;
      --toolbar-hover-fg: black;
      --toolbar-hover-filter: var(--filter-dark);
      --toolbar-disabled-fg: black;
      --toolbar-disabled-bg: green;
    }
  }
</style>
