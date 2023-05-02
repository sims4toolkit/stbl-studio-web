<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type SelectionGroup from "src/lib/models/selection-group";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import saltedUuid from "src/lib/utilities/uuid";
  const { fnv32 } = window.S4TK.hashing;
  const { formatStringKey } = window.S4TK.formatting;

  export let onComplete: () => void;
  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  const updatedKeys = selectionGroup.allSelectedItems.map((item) => {
    const newKey = fnv32(`${project.uuid}:${saltedUuid()}`);
    return {
      id: item.id,
      oldKeyString: formatStringKey(item.key),
      newKey: newKey,
      newKeyString: formatStringKey(newKey),
      string: project.stbl.getValue(item.id),
    };
  });

  let multipageState = {
    currentPage: 1,
    nextButtonEnabled: true,
  };

  function rehashKeys() {
    project.updateKeys(updatedKeys);
    project = project;
    onComplete();
  }
</script>

<MultipageContentGroup
  title="Rehash Keys"
  numPages={1}
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Rehash"
  onLastPageComplete={rehashKeys}
>
  <div slot="content" class="w-full">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div>
        <p>Are you sure you want to rehash the following strings?</p>
        <div class="my-4 max-h-24 overflow-x-hidden overflow-y-auto">
          <ul class="list-disc pl-8 flex flex-col">
            {#each updatedKeys as update, key (key)}
              <li class="px-2 max-w-max">
                <p class="whitespace-nowrap text-ellipsis overflow-x-hidden">
                  <span
                    class="text-accent-primary-light dark:text-accent-primary-dark hacker-text-lime monospace"
                    >{update.oldKeyString}</span
                  >
                  &rarr;
                  <span
                    class="text-accent-primary-light dark:text-accent-primary-dark hacker-text-lime monospace"
                    >{update.newKeyString}</span
                  >
                  ({update.string})
                </p>
              </li>
            {/each}
          </ul>
        </div>
        <p class="text-subtle text-xs">
          This action cannot be undone. You'll have to update keys in tuning.
        </p>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
