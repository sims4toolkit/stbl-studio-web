<script lang="ts">
  import ToolbarColor from "../../../enums/toolbar-colors";
  import type { StblProject } from "../../../global";
  import ContentArea from "../../shared/ContentArea.svelte";
  import FloatingActionButtons from "../../shared/FloatingActionButtons.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import SelectModeToggle from "../../shared/SelectModeToggle.svelte";
  import SplitView from "../../shared/SplitView.svelte";

  let selectMode = false;
  let projects: StblProject[] = []; // FIXME:

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
    <slot>
      <SplitView>
        <SectionHeader slot="left" title="My Workspace" />
        <SelectModeToggle
          slot="right"
          bind:selectMode
          bind:selectables={projects}
        />
      </SplitView>
    </slot>
  </ContentArea>
</section>
<FloatingActionButtons buttonData={toolbarData} />

<style lang="scss">
  #home {
    margin-top: 50px;
  }
</style>
