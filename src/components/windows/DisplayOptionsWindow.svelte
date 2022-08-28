<script lang="ts">
  import Settings from "src/lib/services/settings";
  import {
    FilterTerm,
    filterTypeOptions,
    sortOrderOptions,
  } from "src/lib/utilities/string-display";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Switch from "src/components/elements/Switch.svelte";
  import Select from "src/components/elements/Select.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";

  export let onClose: () => void;
  export let filters: FilterTerm[] = [];

  let entriesPerPage = Settings.entriesPerPage;

  function handleEntriesPerPageBlur() {
    if (entriesPerPage < 1) entriesPerPage = 1;
    else if (entriesPerPage > 100) entriesPerPage = 100;
    Settings.entriesPerPage = entriesPerPage;
  }

  function addFilter() {
    filters.push({ type: 0, text: "" });
    filters = filters;
  }

  function deleteFilter(index: number) {
    filters.splice(index, 1);
    filters = filters;
  }
</script>

<MovableWindow title="Display Options" {onClose}>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-3">
      <div>
        <label
          for="entries-per-page-input"
          class="uppercase text-xs font-bold text-subtle"
          >entries per page</label
        >
        <div class="flex gap-6 justify-between items-center">
          <div class="w-full">
            <input
              disabled={Settings.showAllStrings}
              class="w-full block h-10 px-2 mt-2 rounded text-sm placeholder-gray-500 dark:placeholder-gray-500 bg-transparent border"
              name="entries-per-page-input"
              min="1"
              max="100"
              type="number"
              placeholder="#"
              bind:value={entriesPerPage}
              on:blur={handleEntriesPerPageBlur}
            />
          </div>
          <Switch label="Show All" bind:checked={Settings.showAllStrings} />
        </div>
      </div>
      {#if Settings.showAllStrings}
        <p class="text-xs text-red-600 dark:text-red-400">
          <span class="font-bold text-red-600 dark:text-red-400">WARNING:</span>
          Larger projects might lag or freeze.
        </p>
      {/if}
    </div>
    <div>
      <Select
        label="sort order"
        name="entries-sort-order-select"
        fillWidth={true}
        bind:selected={Settings.sortOrder}
        options={sortOrderOptions}
      />
    </div>
    <div>
      <p class="uppercase text-subtle text-xs font-bold mb-2">
        Filter / Search
      </p>
      {#each filters as filter, key (key)}
        <div class="flex items-center gap-2 mb-2">
          <Select
            name="filter-select-{key}"
            bind:selected={filter.type}
            options={filterTypeOptions}
          />
          <TextInput
            name="filter-input-{key}"
            placeholder="Text..."
            fillWidth={true}
            bind:value={filter.text}
          />
          <button class="font-bold" on:click={() => deleteFilter(key)}
            >&times;</button
          >
        </div>
      {/each}
      <div class="w-full flex justify-center">
        <button
          class="flex justify-center items-center gap-2 py-2 px-4 text-sm rounded default-button"
          on:click={addFilter}
          ><img
            src="./assets/plus.svg"
            class="svg hover:svg-invert h-4"
            alt="+"
          />Add Filter</button
        >
      </div>
    </div>
  </div>
</MovableWindow>
