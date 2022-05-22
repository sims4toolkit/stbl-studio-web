<script lang="ts">
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import SelectionGroup from "../../../typescript/models/selection-group";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SplitView from "../../layout/SplitView.svelte";
  import FloatingActionButtonGroup from "../../elements/FloatingActionButtonGroup.svelte";
  import SelectModeToggle from "../../elements/SelectModeToggle.svelte";
  import ProjectViewGroup from "./ProjectViewGroup.svelte";
  import Downloader from "../../elements/Downloader.svelte";
  import { activeWorkspace } from "../../../typescript/stores";
  import BlurOverlay from "../../layout/BlurOverlay.svelte";
  import ProjectCreationView from "./ProjectCreationView.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import StickyCloseButton from "../../elements/StickyCloseButton.svelte";
  import ProjectDeletionView from "./ProjectDeletionView.svelte";
  import ProjectUploadView from "./ProjectUploadView.svelte";

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
    if (project) workspace.addProject(project);
  }

  let uploadingProject = false;
  function onProjectUploaderExit(project?: Project) {
    uploadingProject = false;
    if (project) workspace.addProject(project);
  }

  let confirmingDeletion = false;
  function onDeletionComplete() {
    confirmingDeletion = false;
  }

  $: workspaceEmpty = Boolean(!workspace?.projects.length);
  $: toolbarDisabledText = workspace ? "none selected" : "no workspace";
  $: toolbarDisabled = !workspace || selectionGroup?.noneSelected;
  $: selectedProjects = selectionGroup?.allSelections.map((uuid) =>
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
      title: "upload",
      icon: "upload",
      color: ToolbarColor.Upload,
      async onClick() {
        uploadingProject = true;
      },
    },
    {
      title: "create",
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
  <StickyCloseButton
    onClick={() => {
      creatingProject = false;
    }}
  />
{/if}

{#if uploadingProject}
  <BlurOverlay>
    <ProjectUploadView slot="content" onComplete={onProjectUploaderExit} />
  </BlurOverlay>
  <StickyCloseButton
    onClick={() => {
      uploadingProject = false;
    }}
  />
{/if}

{#if confirmingDeletion}
  <BlurOverlay>
    <ProjectDeletionView
      slot="content"
      {selectedProjects}
      onComplete={onDeletionComplete}
    />
  </BlurOverlay>
  <StickyCloseButton
    onClick={() => {
      confirmingDeletion = false;
    }}
  />
{/if}

<style lang="scss">
  #home-section {
    &.center-v {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
