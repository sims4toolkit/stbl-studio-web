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

  export let project: Project;
  export let selectionGroup: SelectionGroup<StringEntry, number>;
  export let onComplete: () => void;

  let refreshMethod = 1; // string value

  const keySubscriptions = [subscribeToKey("Escape", onComplete)];

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  function handleNextButtonClick() {
    const replacements: [number, number][] =
      selectionGroup.allSelectedItems.map((entry) => {
        const newKey =
          refreshMethod === 0
            ? fnv32(uuidv4())
            : fnv32(project.uuid + ":" + entry.value);

        return [entry.key, newKey];
      });

    project.updateKeys(replacements);
    project = project;
    selectionGroup.toggleSelectMode(false);

    onComplete();
  }
</script>

<MultipageModalContent
  title="Rehash Keys"
  numPages={1}
  finalPageNextButtonText="Rehash Keys"
  onNextButtonClick={handleNextButtonClick}
>
  <div slot="content">
    <Select
      label="rehash method"
      name="rehash-method-select"
      bind:selected={refreshMethod}
      options={[
        {
          value: 0,
          text: "Random UUID",
        },
        {
          value: 1,
          text: "String Value",
        },
      ]}
    />
    <p class="subtle-text">
      {#if refreshMethod === 0}Completely random UUIDs will be generated and
        hashed for each string.{:else}The project's UUID concatenated with the
        string's content will be hashed for each string.{/if}
    </p>
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
