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
      color="#3DA8D0"
      title="download"
      icon="desktop-download"
      {toggleTitle}
    />
    <FloatingActionButton
      color="#6B77D3"
      title="upload"
      icon="upload"
      {toggleTitle}
    />
    <FloatingActionButton
      last={true}
      color="#48AD6F"
      title="create new"
      icon="plus"
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
      font-size: 0.85em;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
    }

    .buttons-row {
      display: flex;
    }
  }
</style>
