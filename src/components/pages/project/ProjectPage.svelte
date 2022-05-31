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
  import Pagination from "../../shared/controls/Pagination.svelte";
  import StringEditCell from "./StringEditCell.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
  import ProjectView from "../../../typescript/enums/project-view";
  import ScreenDimmer from "../../shared/layout/ScreenDimmer.svelte";
  import StblJsonView from "./StblJsonView.svelte";
  import type { StringEntry } from "@s4tk/models/types";
  import StringDeletionView from "./StringDeletionView.svelte";
  import BlurOverlay from "../../shared/layout/BlurOverlay.svelte";
  import StringCreationView from "./StringCreationView.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  export let params: { uuid: string };
  let project: Project;
  let selectionGroup: SelectionGroup<StringEntry, number>;
  let entries: StringEntry[];
  let isDeletingStrings = false;

  $: {
    if (project) {
      entries = project?.primaryStbl.entries;
      selectionGroup.selectables = entries;
    }
  }

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      project = workspace.projects.find(({ uuid }) => uuid === params.uuid);
      entries = project?.primaryStbl.entries;
      selectionGroup = new SelectionGroup(entries, "id", () => {
        selectionGroup = selectionGroup;
      });
    }
  });

  onDestroy(() => {
    unsubscribe();
  });

  function updateView(view: ProjectView) {
    project.view = view;
    project.saveMetaData();
  }

  function updateStblMap() {
    project.saveStblMap();
  }

  let isCreatingString = false;
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
            <SelectModeToggle {selectionGroup} />
          </div>
        </SplitView>
      </div>
      {#if project.view === ProjectView.Json}
        <StblJsonView stbl={project?.primaryStbl} />
      {:else if project.view === ProjectView.Translate}
        Translate
      {:else if project.primaryStbl.size}
        <div
          class:drop-shadow={project.view !== ProjectView.Grid}
          class:grid-view={project.view === ProjectView.Grid}
        >
          {#each entries.slice(0, 10) as entry, key (key)}
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

<!-- <Pagination /> -->

<ProjectActionButtons
  bind:project
  bind:selectionGroup
  createNewStringEntry={() => (isCreatingString = true)}
  deleteStringEntry={() => (isDeletingStrings = true)}
/>

{#if isCreatingString}
  <ScreenDimmer>
    <StringCreationView
      bind:project
      onComplete={() => (isCreatingString = false)}
    />
  </ScreenDimmer>
{/if}

{#if isDeletingStrings}
  <BlurOverlay onClose={() => (isDeletingStrings = false)}>
    <StringDeletionView
      bind:project
      selectedEntries={selectionGroup.allSelectedItems}
      onComplete={() => {
        selectionGroup.toggleSelectMode(false);
        isDeletingStrings = false;
      }}
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
</style>
