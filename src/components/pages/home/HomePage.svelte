<script lang="ts">
  import type Project from "../../../models/project";
  import type Workspace from "../../../models/workspace";
  import SelectionGroup from "../../../models/selection-group";
  import ToolbarColor from "../../../enums/toolbar-colors";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SplitView from "../../layout/SplitView.svelte";
  import FloatingActionButtonGroup from "../../shared/FloatingActionButtonGroup.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import SelectModeToggle from "../../shared/SelectModeToggle.svelte";
  import ProjectViewGroup from "../../views/ProjectViewGroup.svelte";
  import Downloader from "../../shared/Downloader.svelte";
  import { activeWorkspace } from "../../../services/stores";

  let workspace: Workspace;
  let selectionGroup: SelectionGroup<Project>;
  activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      selectionGroup = new SelectionGroup(value.projects, "uuid", () => {
        selectionGroup = selectionGroup;
      });
    }
  });

  let showDownload = false;
  let downloadFilename: string;
  let downloadContentGenerator: () => Blob;
  function download(filename: string, contentGenerator: () => Blob) {
    downloadFilename = filename;
    downloadContentGenerator = contentGenerator;
    showDownload = true;
  }

  $: workspaceEmpty = Boolean(!workspace?.projects.length);
  $: toolbarDisabledText = workspace ? "no workspace" : "not selected";
  $: toolbarDisabled = !workspace || selectionGroup?.noneSelected;

  const normalModeToolbar = [
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      async onClick() {
        download("StblStudioWorkspace.json", () => workspace.toBlob());
      },
    },
    {
      title: "upload",
      icon: "upload",
      color: ToolbarColor.Upload,
      async onClick() {
        alert("Upload Clicked");
      },
    },
    {
      title: "create",
      icon: "plus",
      color: ToolbarColor.Create,
      async onClick() {
        workspace.addProject(); // FIXME:
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      async onClick() {
        alert("Delete Clicked");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      async onClick() {
        alert("Merge Clicked");
      },
    },
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      async onClick() {
        alert("Download Clicked");
      },
    },
  ];

  $: toolbarData = selectionGroup?.selectMode
    ? selectModeToolbar
    : normalModeToolbar;
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="home-section" class:center-v={workspaceEmpty}>
  {#if workspace}
    {#if workspaceEmpty}
      <ContentArea>
        <slot>
          <div>
            <h1 class="mb-2">
              <span class="default-gradient-text">Your workspace is empty.</span
              >
            </h1>
            <p>
              Upload existing string tables or create new ones with the toolbar
              in the bottom-right corner.
            </p>
            <p>
              Confused? Read <a href="#/help">the help page</a> to learn how to use
              String Table Studio.
            </p>
          </div>
        </slot>
      </ContentArea>
    {:else}
      <ContentArea>
        <slot>
          <div class="mb-2">
            <SplitView>
              <SectionHeader slot="left" title="My Workspace" />
              <SelectModeToggle slot="right" bind:selectionGroup />
            </SplitView>
          </div>
          <ProjectViewGroup bind:selectionGroup />
        </slot>
      </ContentArea>
    {/if}
  {/if}
</section>
<FloatingActionButtonGroup
  buttonData={toolbarData}
  disabled={toolbarDisabled}
  disabledText={toolbarDisabledText}
/>
{#if showDownload}
  <Downloader
    filename={downloadFilename}
    contentGenerator={downloadContentGenerator}
    onDownload={() => (showDownload = false)}
  />
{/if}

<style lang="scss">
  #home-section {
    padding-top: 50px;
    min-height: 100vh;

    &.center-v {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
