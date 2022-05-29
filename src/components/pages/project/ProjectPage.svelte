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
  import StringEntryEditCell from "./StringEntryEditCell.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
  import ProjectView from "../../../typescript/enums/project-view";

  const { formatAsHexString } = window.S4TK.formatting;

  export let params: { uuid: string };
  let project: Project;

  let selectionGroup = new SelectionGroup<{ key: number; value: string }>(
    [],
    "key",
    () => {
      selectionGroup = selectionGroup;
    }
  ); // FIXME:

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      project = workspace.projects.find(({ uuid }) => uuid === params.uuid);
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

  let isEditing = false;

  $: toolbarDisabledText = workspace ? "none selected" : "no workspace";
  $: toolbarDisabled = !workspace || selectionGroup?.noneSelected;
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
      <div
        class:drop-shadow={project.view !== ProjectView.Grid}
        class:grid-view={project.view === ProjectView.Grid}
      >
        {#each project.primaryStbl.entries.slice(0, 10) as entry, key (key)}
          <StringEntryEditCell
            stringEntry={entry}
            isGrid={project.view === ProjectView.Grid}
            onEdit={updateStblMap}
          />
        {/each}
      </div>
    </ContentArea>
  {/if}
</section>

<Pagination />

<!-- TODO: bind to actual values -->
<ProjectActionButtons
  disabled={false}
  disabledText="disabled"
  isSelecting={false}
/>

<style lang="scss">
  .grid-view {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  }
</style>
