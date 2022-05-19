<script lang="ts">
  import FloatingActionButton from "./FloatingActionButton.svelte";

  export let buttonData: {
    color: string;
    title: string;
    icon: string;
    onClick(): void;
  }[];

  let titleContainer: HTMLDivElement;
  let titleText: string;
  let titleColor: string;
  $: showTitle = Boolean(titleText);

  function toggleTitle(text?: string, color?: string) {
    titleText = text;
    titleColor = color;

    if (titleText) {
      titleContainer.style.backgroundColor = titleColor;
    }
  }
</script>

<div class="floating-action-buttons">
  <div bind:this={titleContainer} class="title-container" hidden={!showTitle}>
    {titleText}
  </div>
  <div class="buttons-row">
    {#each buttonData as data, key (key)}
      <FloatingActionButton
        first={key === 0}
        last={key === buttonData.length - 1}
        color={data.color}
        title={data.title}
        icon={data.icon}
        handleClick={data.onClick}
        {toggleTitle}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .floating-action-buttons {
    position: fixed;
    bottom: 25px;
    right: 25px;

    .title-container {
      margin-bottom: 8px;
      border-radius: 4px;
      text-align: center;
      text-transform: uppercase;
      font-size: 0.85em;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
    }

    .buttons-row {
      display: flex;
    }
  }
</style>
