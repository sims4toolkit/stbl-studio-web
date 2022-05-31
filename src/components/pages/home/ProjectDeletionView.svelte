<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import TextInput from "../../shared/elements/TextInput.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  export let selectedProjects: Project[];
  export let onComplete: () => void;

  let deletionConfirmed = false;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  function deleteSelectedProjects() {
    if (deletionConfirmed) workspace.deleteProjects(...selectedProjects);
    onComplete();
  }
</script>

<MultipageModalContent
  title="Confirm Deletion"
  numPages={1}
  completePages={deletionConfirmed ? 1 : 0}
  currentPage={1}
  finalPageNextButtonText="Delete Projects"
  onNextButtonClick={deleteSelectedProjects}
>
  <div slot="content">
    <p class="mt-2">
      Are you sure you want to permanently delete the following projects?
    </p>
    <ul class="mb-2">
      {#each selectedProjects as project, key (key)}
        <li>{project.name} ({project.numStrings} strings)</li>
      {/each}
    </ul>
    <TextInput
      name="confirm-deletion-input"
      placeholder="Yes"
      label="type &quot;yes&quot; to confirm"
      fillWidth={true}
      bind:isValid={deletionConfirmed}
      focusOnMount={true}
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
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
