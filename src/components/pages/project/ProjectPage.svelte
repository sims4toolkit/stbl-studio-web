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
      <GradientHeader title={project.name} />
      {#if isEditing}
        <StringEntryCell stringEntry={{ key: 123, value: "Hello" }} />
      {:else}
        <p
          on:click={() => console.log("click")}
          on:dblclick={() => console.log("dbl click")}
        >
          Double click me
        </p>
      {/if}
    </ContentArea>
    <ContentArea banded={false}>
      <div class="flex-space-between flex-center-v my-1">
        <div class="mb-2">
          <p class="small-title">other views</p>
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
        <SelectModeToggle {selectionGroup} />
      </div>
      <div>
        <StringEntryCell stringEntry={{ key: 123, value: "Hello" }} />
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
