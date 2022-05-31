<script lang="ts">
  import { onDestroy } from "svelte";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import SelectionGroup from "../../../typescript/models/selection-group";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";
  import SelectModeToggle from "../../shared/controls/SelectModeToggle.svelte";
  import ProjectViewGroup from "./ProjectViewGroup.svelte";
  import Downloader from "../../shared/controls/Downloader.svelte";
  import { activeWorkspace } from "../../../typescript/stores";
  import BlurOverlay from "../../shared/layout/BlurOverlay.svelte";
  import ProjectCreationView from "./ProjectCreationView.svelte";
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import ProjectDeletionView from "./ProjectDeletionView.svelte";
  import ProjectUploadView from "./ProjectUploadView.svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";

  let workspace: Workspace;
  let selectionGroup: SelectionGroup<Project>;
  const unsubscribeWorkspace = activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      selectionGroup = new SelectionGroup(value.projects, "uuid", () => {
        selectionGroup = selectionGroup;
      });
    }
  });

  const unsubscribeKeyN = subscribeToKey("n", () => (creatingProject = true), {
    ctrlOrMeta: true,
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", () => {
    if (selectionGroup.selectMode) {
      selectionGroup.toggleSelectMode(false);
    } else if (creatingProject) {
      creatingProject = false;
    }
  });

  onDestroy(() => {
    unsubscribeWorkspace();
    unsubscribeKeyN();
    unsubscribeKeyEsc();
  });

  let creatingProject = false;
  const stopCreatingProject = () => (creatingProject = false);

  let uploadingProject = false;
  const stopUploadingProject = () => (uploadingProject = false);

  let confirmingDeletion = false;
  const stopConfirmingDeletion = () => (confirmingDeletion = false);

  let showDownload = false;
  let downloadFilename: string;
  let downloadContentGenerator: () => Blob;
  function download(filename: string, contentGenerator: () => Blob) {
    downloadFilename = filename;
    downloadContentGenerator = contentGenerator;
    showDownload = true;
  }

  $: workspaceEmpty = Boolean(!workspace?.projects.length);
  $: toolbarDisabledText = workspace ? "none selected" : "no workspace";
  $: toolbarDisabled = !workspace || selectionGroup?.noneSelected;
  $: selectedProjects = selectionGroup?.allSelectedKeys.map((uuid) =>
    workspace.getProject(uuid)
  );

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
      title: "upload project",
      icon: "upload",
      color: ToolbarColor.Upload,
      async onClick() {
        uploadingProject = true;
      },
    },
    {
      title: "new project",
      icon: "plus",
      color: ToolbarColor.Create,
      async onClick() {
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
        confirmingDeletion = true;
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

<section id="home-section" class:flex-center-v={workspaceEmpty}>
  {#if workspace}
    {#if workspaceEmpty}
      <ContentArea>
        <div>
          <GradientHeader title="Your workspace is empty" />
          <p class="mt-2">
            Upload existing string tables or create new ones with the toolbar in
            the bottom-right corner.
          </p>
          <p>
            Confused? Visit the <a href="#/help">help page</a> to learn how to use
            String Table Studio.
          </p>
        </div>
      </ContentArea>
    {:else}
      <ContentArea>
        <div class="mb-2">
          <SplitView centerOnCollapse={true}>
            <GradientHeader slot="left" title="My Workspace" />
            <SelectModeToggle slot="right" bind:selectionGroup />
          </SplitView>
        </div>
        <ProjectViewGroup bind:selectionGroup />
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
  <BlurOverlay onClose={stopCreatingProject}>
    <ProjectCreationView onComplete={stopCreatingProject} />
  </BlurOverlay>
{/if}

{#if uploadingProject}
  <BlurOverlay onClose={stopUploadingProject}>
    <ProjectUploadView onComplete={stopUploadingProject} />
  </BlurOverlay>
{/if}

{#if confirmingDeletion}
  <BlurOverlay onClose={stopConfirmingDeletion}>
    <ProjectDeletionView
      {selectedProjects}
      onComplete={stopConfirmingDeletion}
    />
  </BlurOverlay>
{/if}

<style lang="scss">
  // intentionally blank
</style>
