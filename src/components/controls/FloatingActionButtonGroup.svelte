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
