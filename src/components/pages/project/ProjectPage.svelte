<script lang="ts">
  import { onDestroy } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import StringEntryCell from "./StringEntryCell.svelte";
  import SelectModeToggle from "../../shared/controls/SelectModeToggle.svelte";
  import SelectionGroup from "../../../typescript/models/selection-group";
  import ProjectActionButtons from "./ProjectActionButtons.svelte";
  import IconTextButton from "../../shared/elements/IconTextButton.svelte";

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
      <div class="flex-space-between">
        <div>
          <GradientHeader title={project.name} />
          <p class="mb-0 monospace subtle-text">
            {formatAsHexString(project.group, 8)}-{formatAsHexString(
              project.instanceBase,
              14
            )}
          </p>
        </div>
        <div>
          <p class="small-title mt-0">other views</p>
          <div class="flex-center-v flex-gap">
            <IconTextButton
              icon="curly-braces"
              text="JSON"
              onClick={() => {}}
            />
            <IconTextButton
              icon="language-outline"
              text="Translate"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </ContentArea>
    <ContentArea banded={false}>
      <div class="flex-space-between flex-center-v mb-1">
        <p class="subtle-text my-0">Showing X of X strings</p>
        <SelectModeToggle {selectionGroup} />
      </div>
      <div class="drop-shadow">
        <StringEntryCell
          stringEntry={{ key: 0x12345678, value: "This is a string." }}
        />
        <StringEntryCell
          stringEntry={{ key: 0x12345678, value: "This is a string." }}
        />
        <StringEntryCell
          stringEntry={{ key: 0x12345678, value: "This is a string." }}
        />
        <StringEntryCell
          stringEntry={{ key: 0x12345678, value: "This is a string." }}
        />
      </div>
    </ContentArea>
  {/if}
</section>

<!-- TODO: bind to actual values -->
<ProjectActionButtons
  disabled={false}
  disabledText="disabled"
  isSelecting={false}
/>

<style lang="scss">
  // intentionally blank
</style>
