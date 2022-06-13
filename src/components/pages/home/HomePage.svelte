<script lang="ts">
  import { onDestroy } from "svelte";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import SelectionGroup from "../../../typescript/models/selection-group";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
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
  import HomeActionButtons from "./HomeActionButtons.svelte";
  import ProjectMergeView from "./ProjectMergeView.svelte";

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

  let creatingProject = false;
  let uploadingProject = false;
  let confirmingDeletion = false;
  let mergingProjects = false;

  let showDownload = false;
  let downloadFilename: string;
  let downloadContentGenerator: () => Blob;
  function download(filename: string, contentGenerator: () => Blob) {
    downloadFilename = filename;
    downloadContentGenerator = contentGenerator;
    showDownload = true;
  }

  $: inModal = creatingProject || uploadingProject || confirmingDeletion;
  $: workspaceEmpty = Boolean(!workspace?.projects.length);
  $: selectedProjects = selectionGroup?.allSelectedKeys.map((uuid) =>
    workspace.getProject(uuid)
  );

  const keySubscriptions = [
    subscribeToKey(
      "e",
      () => {
        if (!inModal && workspace?.projects?.length) {
          selectionGroup.toggleSelectMode();
        }
      },
      {
        ctrlOrMeta: true,
        preventDefault: true,
      }
    ),
  ];

  onDestroy(() => {
    unsubscribeWorkspace();
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  async function handleAction(action: HomeAction) {
    switch (action) {
      case "save-workspace":
        download("StblStudioWorkspace.json", () => workspace.toBlob());
        break;
      case "upload":
        uploadingProject = true;
        break;
      case "create":
        creatingProject = true;
        break;
      case "delete":
        confirmingDeletion = true;
        break;
      case "merge":
        mergingProjects = true;
        break;
      case "download":
        // TODO:
        alert(action);
        break;
    }
  }
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

<HomeActionButtons
  {inModal}
  inSelectMode={selectionGroup?.selectMode}
  numSelected={selectionGroup?.allSelectedKeys.length}
  onAction={handleAction}
/>

{#if showDownload}
  <Downloader
    filename={downloadFilename}
    contentGenerator={downloadContentGenerator}
    onDownload={() => (showDownload = false)}
  />
{/if}

{#if creatingProject}
  <BlurOverlay onClose={() => (creatingProject = false)}>
    <ProjectCreationView onComplete={() => (creatingProject = false)} />
  </BlurOverlay>
{/if}

{#if uploadingProject}
  <BlurOverlay onClose={() => (uploadingProject = false)}>
    <ProjectUploadView onComplete={() => (uploadingProject = false)} />
  </BlurOverlay>
{/if}

{#if confirmingDeletion}
  <BlurOverlay onClose={() => (confirmingDeletion = false)}>
    <ProjectDeletionView
      {selectedProjects}
      onComplete={() => (confirmingDeletion = false)}
    />
  </BlurOverlay>
{/if}

{#if mergingProjects}
  <BlurOverlay onClose={() => (mergingProjects = false)}>
    <ProjectMergeView
      {selectedProjects}
      onComplete={() => (mergingProjects = false)}
    />
  </BlurOverlay>
{/if}

<style lang="scss">
  // intentionally blank
</style>
