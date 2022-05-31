<script lang="ts">
  import type { StringEntry } from "@s4tk/models/types";
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import TextInput from "../../shared/elements/TextInput.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<StringEntry, number>;
  export let onComplete: () => void;

  let deletionConfirmed = false;

  function deleteSelectedEntries() {
    if (deletionConfirmed) {
      project.deleteEntries(selectionGroup.allSelectedKeys);
      selectionGroup.toggleSelectMode(false);
      project = project;
    }

    onComplete();
  }
</script>

<MultipageModalContent
  title="Confirm Deletion"
  numPages={1}
  completePages={deletionConfirmed ? 1 : 0}
  currentPage={1}
  finalPageNextButtonText="Delete Strings"
  onNextButtonClick={deleteSelectedEntries}
>
  <div slot="content">
    <p class="mt-2">
      Are you sure you want to permanently delete the following strings?
    </p>
    <ul class="mb-2">
      {#each selectionGroup.allSelectedItems as entry, key (key)}
        <li>{entry.key} = {entry.string}</li>
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
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
