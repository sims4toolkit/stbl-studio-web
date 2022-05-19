<script lang="ts">
  import ToolbarColor from "../../../enums/toolbar-colors";
  import ContentArea from "../../shared/ContentArea.svelte";
  import FloatingActionButtons from "../../shared/FloatingActionButtons.svelte";
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="home">
  <ContentArea banded={false}>
    <slot>First</slot>
  </ContentArea>
  <ContentArea banded={true}>
    <slot>Second</slot>
  </ContentArea>
</section>
<FloatingActionButtons
  buttonData={[
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      onClick() {
        console.log("Save Clicked");
      },
    },
    {
      title: "upload stbl",
      icon: "upload",
      color: ToolbarColor.Upload,
      onClick() {
        console.log("Upload Clicked");
      },
    },
    {
      title: "create stbl",
      icon: "plus",
      color: ToolbarColor.Create,
      onClick() {
        console.log("Create Clicked");
      },
    },
    {
      title: "merge stbls",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      onClick() {
        console.log("Merge Clicked");
      },
    },
    {
      title: "delete stbls",
      icon: "trash",
      color: ToolbarColor.Delete,
      onClick() {
        console.log("Delete Clicked");
      },
    },
  ]}
/>

<style lang="scss">
  // intentionally blank
</style>
