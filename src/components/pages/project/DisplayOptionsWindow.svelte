<script lang="ts">
  import type { StringFilterTerm } from "../../../global";
  import FilterType from "../../../typescript/enums/filter-type";
  import SortOrder from "../../../typescript/enums/sort-order";
  import EntriesPerPage from "../../shared/controls/EntriesPerPage.svelte";
  import IconTextButton from "../../shared/elements/IconTextButton.svelte";
  import Select from "../../shared/elements/Select.svelte";
  import TextInput from "../../shared/elements/TextInput.svelte";
  import MovableWindow from "../../shared/layout/MovableWindow.svelte";

  export let showDisplayOptions: boolean;
  export let selectedSortOrder: SortOrder;
  export let filters: StringFilterTerm[];

  const sortOptions = [
    {
      text: "Chronological",
      value: SortOrder.Chronological,
    },
    {
      text: "Alphanumeric",
      value: SortOrder.Alphanumeric,
    },
    {
      text: "Reverse Alphanumeric",
      value: SortOrder.ReverseAlphanumeric,
    },
  ];

  const filterItemOptions = [
    {
      text: "Contains",
      value: FilterType.Contains,
    },
    {
      text: "Exact Match",
      value: FilterType.ExactMatch,
    },
    {
      text: "Begins With",
      value: FilterType.BeginsWith,
    },
    {
      text: "Ends With",
      value: FilterType.EndsWith,
    },
    {
      text: "Regex",
      value: FilterType.Regex,
    },
    {
      text: "Key Equals",
      value: FilterType.KeyEquals,
    },
  ];

  function addFilter() {
    filters.push({
      type: FilterType.Contains,
      text: "",
    });

    filters = filters;
  }

  function deleteFilter(index: number) {
    filters.splice(index, 1);
    filters = filters;
  }
</script>

<MovableWindow
  title="Display Options"
  onClose={() => (showDisplayOptions = false)}
>
  <div class="flex-col flex-gap">
    <EntriesPerPage />
    <Select
      name="sort-select"
      bind:selected={selectedSortOrder}
      options={sortOptions}
      subtleBorder={true}
      fillWidth={true}
      label="sort order"
    />
    <div class="flex-col flex-gap-small">
      <p class="my-0 small-title">filters</p>
      {#each filters as filter, key (key)}
        <div class="flex-center-v flex-gap-small">
          <Select
            name="filter-select-{key}"
            bind:selected={filter.type}
            options={filterItemOptions}
            subtleBorder={true}
          />
          <TextInput
            name="filter-input-{key}"
            placeholder="Text..."
            fillWidth={true}
            bind:value={filter.text}
            subtleBorder={true}
          />
          <button class="button-wrapper bold" on:click={() => deleteFilter(key)}
            >&times;</button
          >
        </div>
      {/each}
    </div>

    <div class="w-100 flex-center-h">
      <IconTextButton
        icon="plus"
        onClick={addFilter}
        text="Add Filter"
        border={false}
      />
    </div>
  </div>
</MovableWindow>
