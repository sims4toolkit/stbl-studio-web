<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type { StringEntry } from "@s4tk/models/types";
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import Select from "../../shared/elements/Select.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import { onDestroy } from "svelte";

  const { fnv32 } = window.S4TK.hashing;
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let selectionGroup: SelectionGroup<StringEntry, number>;
  export let onComplete: () => void;

  let currentPage = 1;
  let refreshMethod = 1; // string value
  let replacements: [number, number][];
  let changedReplacements: [number, number][];
  let numUnchanged: number;

  const keySubscriptions = [subscribeToKey("Escape", onComplete)];

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  function handleNextButtonClick() {
    if (currentPage === 1) {
      replacements = selectionGroup.allSelectedItems.map((entry) => {
        const newKey =
          refreshMethod === 0
            ? fnv32(uuidv4())
            : fnv32(project.uuid + ":" + entry.value);

        return [entry.key, newKey];
      });

      changedReplacements = replacements.filter(([old, next]) => old !== next);
      numUnchanged = replacements.length - changedReplacements.length;

      ++currentPage;
    } else {
      ++currentPage;

      if (changedReplacements?.length) {
        project.updateKeys(changedReplacements);
        project = project;
        selectionGroup.toggleSelectMode(false);
      }

      onComplete();
    }
  }
</script>

<MultipageModalContent
  title="Rehash Keys"
  bind:currentPage
  completePages={currentPage}
  numPages={2}
  finalPageNextButtonText={changedReplacements?.length ? "Rehash Keys" : "OK"}
  onNextButtonClick={handleNextButtonClick}
  minimumContentHeight="200"
  centerVertically={true}
>
  <div slot="content" class="w-100">
    <div class="w-100">
      {#if currentPage === 1}
        <Select
          fillWidth={true}
          label="rehash method"
          name="rehash-method-select"
          bind:selected={refreshMethod}
          options={[
            {
              value: 1,
              text: "String Value",
            },
            {
              value: 0,
              text: "Random UUID",
            },
          ]}
        />
        <p class="subtle-text mb-0 mt-2">
          {#if refreshMethod === 0}Completely random UUIDs will be generated and
            hashed for each string.{:else}The project's UUID will be prefixed on
            each string's value before hashing.{/if}
        </p>
      {:else if currentPage === 2}
        {#if changedReplacements?.length === 0}
          <p>
            The chosen hashing method has no effect on any selected strings.
          </p>
        {:else}
          {#if numUnchanged === 1}
            <p class="mt-0">1 entry is unaffected by this change.</p>
          {:else if numUnchanged > 1}
            <p class="mt-0">
              {numUnchanged} entries are unaffected by this change.
            </p>
          {/if}
          <p class="mt-0">
            Are you sure you want to rehash the following entries?
          </p>
          <ul class="rehash-summary">
            {#each changedReplacements as changed, key (key)}
              <li>
                <div class="flex-center-v">
                  <span class="monospace accent-color"
                    >{formatStringKey(changed[0])}</span
                  >
                  &nbsp;&rarr;&nbsp;
                  <span class="monospace accent-color"
                    >{formatStringKey(changed[1])}</span
                  >
                  &nbsp;
                  <span class="nowrap-truncate"
                    >({project.primaryStbl.getByKey(changed[0]).value})</span
                  >
                </div>
              </li>
            {/each}
          </ul>
          <p class="subtle-text mb-0">
            This action cannot be undone. After rehashing, you will have to
            update the keys in your tuning.
          </p>
        {/if}
      {:else}
        <p>Replacing keys...</p>
      {/if}
    </div>
  </div>
</MultipageModalContent>

<style lang="scss">
  ul.rehash-summary {
    max-height: 80px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
