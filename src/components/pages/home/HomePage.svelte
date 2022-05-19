<script lang="ts">
  import ToolbarColor from "../../../enums/toolbar-colors";
  import ContentArea from "../../shared/ContentArea.svelte";
  import FloatingActionButtons from "../../shared/FloatingActionButtons.svelte";

  let selectMode = false;
  $: selectModeToggleText = selectMode ? "X" : "select";

  const normalModeToolbar = [
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      onClick() {
        console.log("Save Clicked");
      },
    },
    {
      title: "upload",
      icon: "upload",
      color: ToolbarColor.Upload,
      onClick() {
        console.log("Upload Clicked");
      },
    },
    {
      title: "create",
      icon: "plus",
      color: ToolbarColor.Create,
      onClick() {
        console.log("Create Clicked");
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      onClick() {
        console.log("Delete Clicked");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      onClick() {
        console.log("Merge Clicked");
      },
    },
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      onClick() {
        console.log("Download Clicked");
      },
    },
  ];

  $: toolbarData = selectMode ? selectModeToolbar : normalModeToolbar;
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="home">
  <ContentArea banded={false}>
    <slot>First</slot>
  </ContentArea>
  <ContentArea banded={true}>
    <slot>
      <div>
        <button
          class="select-toggle"
          on:click={() => (selectMode = !selectMode)}
          >{selectModeToggleText}</button
        >
      </div>
    </slot>
  </ContentArea>
</section>
<FloatingActionButtons buttonData={toolbarData} />

<style lang="scss">
  .select-toggle {
    border: none;
    background: none;
    color: var(--color-text);
    text-transform: uppercase;
    opacity: 0.6;

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
</style>
