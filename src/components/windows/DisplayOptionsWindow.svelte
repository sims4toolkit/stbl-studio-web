<script lang="ts">
  import Settings from "src/lib/services/settings";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Switch from "src/components/elements/Switch.svelte";
  import Select from "../elements/Select.svelte";

  export let onClose: () => void;

  let entriesPerPage = Settings.entriesPerPage;

  function handleEntriesPerPageBlur() {
    if (entriesPerPage < 1) entriesPerPage = 1;
    else if (entriesPerPage > 100) entriesPerPage = 100;
    Settings.entriesPerPage = entriesPerPage;
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
        options={[
          {
            value: 0,
            text: "Chronological",
          },
          {
            value: 1,
            text: "Alphanumeric",
          },
          {
            value: 2,
            text: "Reverse Alphanumeric",
          },
        ]}
      />
    </div>
    <div>
      <p class="uppercase text-subtle text-xs font-bold">Filters</p>
    </div>
  </div>
</MovableWindow>
