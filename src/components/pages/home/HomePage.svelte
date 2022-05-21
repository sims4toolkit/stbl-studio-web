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
  import BlurOverlay from "../../layout/BlurOverlay.svelte";
  import ProjectCreationView from "./ProjectCreationView.svelte";
  import GradientHeader from "../../shared/GradientHeader.svelte";
  import StorageService from "../../../services/storage";

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

  let creatingProject = false;
  function onProjectCreatorExit(project?: Project) {
    creatingProject = false;
  }

  $: workspaceEmpty = Boolean(!workspace?.projects.length);
  $: toolbarDisabledText = workspace ? "none selected" : "no workspace";
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
        // workspace.addProject(); // FIXME:
        creatingProject = true;
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
            <GradientHeader title="Your workspace is empty" />
            <p class="mt-2">
              Upload existing string tables or create new ones with the toolbar
              in the bottom-right corner.
            </p>
            <p>
              Confused? Visit the <a href="#/help">help page</a> to learn how to
              use String Table Studio.
            </p>
          </div>
        </slot>
      </ContentArea>
    {:else}
      <ContentArea>
        <slot>
          <div class="mb-2">
            <SplitView>
              <GradientHeader slot="left" title="My Workspace" />
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

{#if creatingProject}
  <BlurOverlay>
    <ProjectCreationView slot="content" onComplete={onProjectCreatorExit} />
  </BlurOverlay>
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
