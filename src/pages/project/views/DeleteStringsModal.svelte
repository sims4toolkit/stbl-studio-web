<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let onComplete: () => void;
  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  const entriesToDelete = selectionGroup.allSelectedItems.map((item) => {
    return {
      key: formatStringKey(item.key),
      string: project.stbl.getValue(item.id),
    };
  });

  let inputValue = "";
  let multipageState = {
    currentPage: 1,
    nextButtonEnabled: false,
  };

  function deleteStrings() {
    project.deleteStrings(selectionGroup.allSelectedKeys);
    project = project;
    onComplete();
  }
</script>

<MultipageContentGroup
  title="Delete Strings"
  numPages={1}
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Delete"
  onLastPageComplete={deleteStrings}
>
  <div slot="content" class="w-full">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div>
        <p class="mb-4">
          Are you sure you want to permanently delete the following strings?
        </p>
        <div class="max-h-24 overflow-x-hidden overflow-y-auto">
          <ul class="list-disc pl-8 flex flex-col">
            {#each entriesToDelete as entry, key (key)}
              <li class="px-2 max-w-max">
                <p class="whitespace-nowrap text-ellipsis overflow-x-hidden">
                  <span
                    class="text-accent-primary-light dark:text-accent-primary-dark hacker-text-lime monospace"
                    >{entry.key}</span
                  >
                  = {entry.string}
                </p>
              </li>
            {/each}
          </ul>
        </div>
        <div class="my-6">
          <TextInput
            label={'type "delete" to confirm'}
            name="deletion-confirmation-input"
            bind:value={inputValue}
            bind:isValid={multipageState.nextButtonEnabled}
            placeholder="Delete"
            focusOnMount={true}
            fillWidth={true}
            validators={[
              {
                test: (value) => value.toLowerCase().trim() === "delete",
                message: 'Value must be "Delete"',
              },
            ]}
          />
        </div>
        <p class="text-subtle text-xs">
          Deleted strings cannot be recovered. Once they're gone, they're gone.
        </p>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
