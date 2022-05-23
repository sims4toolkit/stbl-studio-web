<script lang="ts">
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";
  import ProgressCircles from "../../elements/ProgressCircles.svelte";
  import TextInput from "../../elements/TextInput.svelte";

  export let selectedProjects: Project[];
  export let onComplete: () => void;

  let deletionConfirmed = false;

  let workspace: Workspace;
  activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  function deleteSelectedProjects() {
    if (deletionConfirmed) workspace.removeProjects(...selectedProjects);
    onComplete();
  }
</script>

<GradientHeader title="Confirm Deletion" />
<p class="mt-2">
  Are you sure you want to permanently delete the following projects?
</p>
<ul class="mb-2">
  {#each selectedProjects as project, key (key)}
    <li>{project.name} ({project.primaryStbl.size} strings)</li>
  {/each}
</ul>
<TextInput
  name="confirm-deletion-input"
  placeholder="Yes"
  label="type &quot;yes&quot; to confirm"
  fillWidth={true}
  bind:isValid={deletionConfirmed}
  validators={[
    {
      error: "Click the X in the top-right corner",
      test(value) {
        return value?.trim().toLowerCase() !== "no";
      },
    },
    {
      error: 'Value must be "yes"',
      test(value) {
        return value?.trim().toLowerCase() === "yes";
      },
    },
  ]}
/>
<p class="subtle-text my-2">
  Deleted projects cannot be recovered. Once they're gone, they're gone.
</p>
<div class="flex-space-between">
  <ProgressCircles circles={1} filled={deletionConfirmed ? 1 : 0} />
  <NavigationButton
    text="Confirm"
    onClick={deleteSelectedProjects}
    direction="right"
    active={deletionConfirmed}
  />
</div>

<style lang="scss">
  // intentionally blank
</style>
