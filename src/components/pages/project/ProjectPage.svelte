<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
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
  import ScreenDimmer from "../../shared/layout/ScreenDimmer.svelte";
  import { deleteProject, Settings } from "../../../typescript/storage";
  import StringTableJsonView from "./StringTableJsonView.svelte";
  import type { StringEntry } from "@s4tk/models/types";
  import StringDeletionView from "./StringDeletionView.svelte";
  import BlurOverlay from "../../shared/layout/BlurOverlay.svelte";

  const { formatAsHexString } = window.S4TK.formatting;
  const { fnv32 } = window.S4TK.hashing;

  export let params: { uuid: string };
  let project: Project;
  let newStringInput: HTMLDivElement;
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

  function startCreatingString() {
    isCreatingString = true;
    setTimeout(() => {
      newStringInput.focus();
    }, 100);
  }

  function createString() {
    setTimeout(() => {
      if (newStringInput.innerHTML) {
        const value = newStringInput.innerHTML.replace(
          /(?:\r\n|\r|\n)/g,
          "\\n"
        );
        const key = fnv32(uuidv4() + value);
        project.addEntry(key, value);
        project = project;
        isCreatingString = false;
      }
    }, 200);
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
            <SelectModeToggle {selectionGroup} />
          </div>
        </SplitView>
      </div>
      {#if project.view === ProjectView.Json}
        <StringTableJsonView stbl={project?.primaryStbl} />
      {:else if project.view === ProjectView.Translate}
        Translate
      {:else if project.primaryStbl.size}
        <div
          class:drop-shadow={project.view !== ProjectView.Grid}
          class:grid-view={project.view === ProjectView.Grid}
        >
          {#each entries.slice(0, 10) as entry, key (key)}
            <StringEntryEditCell
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

<!-- TODO: bind to actual values -->
<ProjectActionButtons
  bind:project
  bind:selectionGroup
  createNewStringEntry={startCreatingString}
  deleteStringEntry={() => (isDeletingStrings = true)}
/>

{#if isCreatingString}
  <ScreenDimmer>
    <div
      transition:fly={{ y: 20, duration: Settings.reduceMotion ? 0 : 500 }}
      class="creating-string-dialog-wrapper flex-center-h px-1"
    >
      <div class="creating-string-dialog flex-col p-1">
        <div class="flex-space-between flex-center-v">
          <p class="small-title mt-0">enter new string</p>
          <button
            class="button-wrapper"
            on:click={() => {
              newStringInput.innerHTML = "";
              isCreatingString = false;
            }}
          >
            <img class="is-svg" src="./assets/x.svg" alt="X" />
          </button>
        </div>
        <div
          class="creating-string-input drop-shadow h-100 p-half"
          contenteditable="true"
          bind:this={newStringInput}
          on:blur={createString}
        />
        <p class="subtle-text mt-1 mb-0">
          A key will be generated by hashing the content of this string with its
          project's UUID.
        </p>
        <p class="subtle-text mt-half mb-0">
          Click anywhere outside of the textbox or press ESC to save this
          string. Click the X to cancel.
        </p>
      </div>
    </div>
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

  .creating-string-dialog-wrapper {
    z-index: 2048;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 100px;

    .creating-string-dialog {
      min-height: 100px;
      border-radius: 8px;
      max-width: 1280px;
      width: 100%;
      background-color: var(--color-bg);
    }

    .creating-string-input {
      min-height: 100px;
      border-radius: 8px;
      padding: 0.5em !important;
      width: 100%;
      background-color: var(--color-bg-secondary);
    }
  }
</style>
