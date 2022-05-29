<script lang="ts">
  import { onDestroy } from "svelte";
  import { replace } from "svelte-spa-router";
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

  const { formatAsHexString } = window.S4TK.formatting;

  export let params: { uuid: string };

  export let view: "list" | "grid" | "json" | "translate" = "list";
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

  function onBackClicked() {
    replace("/");
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
            <p class="mt-0 small-title">{view} view</p>
            <div class="flex-center-v flex-gap flex-wrap">
              <IconButton
                title="List View"
                icon="list-outline"
                onClick={() => (view = "list")}
                active={view !== "list"}
              />
              <IconButton
                title="Grid View"
                icon="grid-outline"
                onClick={() => (view = "grid")}
                active={view !== "grid"}
              />
              <IconButton
                title="JSON View"
                icon="curly-braces"
                onClick={() => (view = "json")}
                active={view !== "json"}
              />
              <IconButton
                title="Translate View"
                icon="language-outline"
                onClick={() => (view = "translate")}
                active={view !== "translate"}
              />
            </div>
          </div>
          <div slot="right">
            <SelectModeToggle {selectionGroup} />
          </div>
        </SplitView>
      </div>
      <div
        class:drop-shadow={view !== "grid"}
        class:grid-view={view === "grid"}
      >
        {#each project.primaryStbl.entries.slice(0, 10) as entry, key (key)}
          <StringEntryEditCell
            stringEntry={entry}
            isGrid={view === "grid"}
            onEdit={() => project.save()}
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
    grid-template-columns: repeat(auto-fill, minmax(616px, 1fr));
  }
</style>
