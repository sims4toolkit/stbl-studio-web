<script lang="ts">
  import FloatingActionButton from "./FloatingActionButton.svelte";

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
  <!-- TODO: Replace with slot -->
  <div class="buttons-row">
    <FloatingActionButton
      first={true}
      color="#62AABF"
      title="first"
      icon="F"
      {toggleTitle}
    />
    <FloatingActionButton
      color="#6B77D3"
      title="second"
      icon="S"
      {toggleTitle}
    />
    <FloatingActionButton
      last={true}
      color="#62C488"
      title="third"
      icon="T"
      {toggleTitle}
    />
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
      font-size: 0.8em;
    }

    .buttons-row {
      display: flex;
    }
  }
</style>
