<script lang="ts">
  import { onDestroy } from "svelte";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import SelectModeToggle from "../../shared/controls/SelectModeToggle.svelte";
  import SelectionGroup from "../../../typescript/models/selection-group";
  import ProjectActionButtons from "./ProjectActionButtons.svelte";
  import IconButton from "../../shared/elements/IconButton.svelte";
  import StringEditCell from "./StringEditCell.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
  import ProjectView from "../../../typescript/enums/project-view";
  import ScreenDimmer from "../../shared/layout/ScreenDimmer.svelte";
  import StblJsonView from "./StblJsonView.svelte";
  import type { StringEntry } from "@s4tk/models/types";
  import StringDeletionView from "./StringDeletionView.svelte";
  import BlurOverlay from "../../shared/layout/BlurOverlay.svelte";
  import StringCreationView from "./StringCreationView.svelte";
  import StblTranslateView from "./StblTranslateView.svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import PaginationController from "../../shared/controls/PaginationController.svelte";
  import StringRehashView from "./StringRehashView.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  export let params: { uuid: string };

  let selectionGroup: SelectionGroup<StringEntry, number>;
  let project: Project;
  let entries: StringEntry[];
  let currentSlice: StringEntry[];
  let isDeletingStrings = false;
  let isCreatingString = false;
  let isRehashingKeys = false;

  $: inModal = isDeletingStrings || isCreatingString;
  $: selectModeDisabled = !entries?.length;

  $: viewAllowsSelect =
    project &&
    (project.view === ProjectView.List || project.view === ProjectView.Grid);

  $: {
    if (project && project.view !== ProjectView.Translate) {
      entries = project?.primaryStbl.entries;
      selectionGroup.selectables = entries;
    }
  }

  let workspace: Workspace;
  const unsubscribeToWorkspace = activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      project = workspace.projects.find(({ uuid }) => uuid === params.uuid);
      entries = project?.primaryStbl.entries;
      selectionGroup = new SelectionGroup(entries, "id", () => {
        selectionGroup = selectionGroup;
      });
    }
  });

  const keySubscriptions = [
    subscribeToKey(
      "e",
      () => {
        if (!inModal && entries?.length) {
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
    unsubscribeToWorkspace();
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  function updateView(view: ProjectView) {
    project.view = view;
    project.saveMetaData();
  }

  function updateStblMap() {
    project.saveStblMap();
  }

  function updateSlice(slice: StringEntry[]) {
    currentSlice = slice;
  }

  async function handleAction(action: ProjectAction) {
    switch (action) {
      case "download":
        // TODO:
        alert(action);
        break;
      case "import":
        // TODO:
        alert(action);
        break;
      case "create":
        isCreatingString = true;
        break;
      case "delete":
        isDeletingStrings = true;
        break;
      case "rehash":
        isRehashingKeys = true;
        break;
    }
  }
</script>

<svelte:head>
  <title>STBL | {project?.name ?? "Loading..."}</title>
</svelte:head>
<section id="project-section">
  {#if Boolean(project)}
    <ContentArea banded={true} bottomShadow={true}>
      <div class="flex-space-between flex-wrap flex-gap-large">
        <div class="mw-100">
          <GradientHeader title={project.name} />
          <p class="mb-0 monospace subtle-text">
            {formatAsHexString(project.group, 8)}-{formatAsHexString(
              project.instanceBase,
              14
            )}
          </p>
        </div>
      </div>
    </ContentArea>
    <ContentArea banded={false}>
      <div class="mb-2">
        <SplitView>
          <div slot="left">
            <p class="mt-0 small-title">{ProjectView[project.view]} view</p>
            <div class="flex-center-v flex-gap flex-wrap">
              <IconButton
                title="List View"
                icon="list-outline"
                onClick={() => updateView(ProjectView.List)}
                active={project.view !== ProjectView.List}
              />
              <IconButton
                title="Grid View"
                icon="grid-outline"
                onClick={() => updateView(ProjectView.Grid)}
                active={project.view !== ProjectView.Grid}
              />
              <IconButton
                title="JSON View"
                icon="curly-braces"
                onClick={() => updateView(ProjectView.Json)}
                active={project.view !== ProjectView.Json}
              />
              <IconButton
                title="Translate View"
                icon="language-outline"
                onClick={() => updateView(ProjectView.Translate)}
                active={project.view !== ProjectView.Translate}
              />
            </div>
          </div>
          <div slot="right">
            {#if viewAllowsSelect}
              <SelectModeToggle
                {selectionGroup}
                disabled={selectModeDisabled}
              />
            {/if}
          </div>
        </SplitView>
      </div>
      {#if project.view === ProjectView.Json}
        <StblJsonView {project} />
      {:else if project.view === ProjectView.Translate}
        <StblTranslateView bind:project bind:entries {currentSlice} />
      {:else if currentSlice && currentSlice.length}
        <div
          class:drop-shadow={project.view !== ProjectView.Grid}
          class:grid-view={project.view === ProjectView.Grid}
        >
          {#each currentSlice as entry (entry.id)}
            <StringEditCell
              {selectionGroup}
              stringEntry={entry}
              isGrid={project.view === ProjectView.Grid}
              onEdit={updateStblMap}
            />
          {/each}
        </div>
      {:else}
        <div class="flex-center flex-col empty-stbl py-3 px-1 text-center">
          <h3>This Project is Empty</h3>
          <p>
            Create or import strings with the toolbar in the bottom-right
            corner.
          </p>
          <p>
            Visit the <a href="#/help" target="_blank">help page</a> to learn about
            key bindings and shortcuts.
          </p>
        </div>
      {/if}
    </ContentArea>
  {/if}
</section>

{#if Boolean(entries) && project.view !== ProjectView.Json}
  <PaginationController
    items={entries}
    {inModal}
    itemsPerPage={10}
    onSliceUpdate={updateSlice}
  />
{/if}

<ProjectActionButtons
  {inModal}
  inSelectMode={selectionGroup?.selectMode}
  numSelected={selectionGroup?.allSelectedKeys?.length ?? 0}
  onAction={handleAction}
/>

{#if isCreatingString}
  <ScreenDimmer>
    <StringCreationView
      bind:project
      onComplete={() => (isCreatingString = false)}
    />
  </ScreenDimmer>
{/if}

{#if isRehashingKeys}
  <BlurOverlay onClose={() => (isRehashingKeys = false)}>
    <StringRehashView
      bind:project
      bind:selectionGroup
      onComplete={() => (isRehashingKeys = false)}
    />
  </BlurOverlay>
{/if}

{#if isDeletingStrings}
  <BlurOverlay onClose={() => (isDeletingStrings = false)}>
    <StringDeletionView
      bind:project
      bind:selectionGroup
      onComplete={() => (isDeletingStrings = false)}
    />
  </BlurOverlay>
{/if}

<style lang="scss">
  .grid-view {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  }

  .empty-stbl {
    width: 100%;
    border: 4px dashed var(--color-divider);
    border-radius: 12px;

    h3,
    p {
      color: var(--color-text-subtle) !important;
    }
  }

  @media only screen and (max-width: 500px) {
    .grid-view {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }
</style>
