<script lang="ts">
  import type { StringFilterTerm } from "../../../global";
  import FilterType from "../../../typescript/enums/filter-type";
  import IconTextButton from "../../shared/elements/IconTextButton.svelte";
  import Select from "../../shared/elements/Select.svelte";
  import TextInput from "../../shared/elements/TextInput.svelte";
  import MovableWindow from "../../shared/layout/MovableWindow.svelte";

  export let showFilterWindow: boolean;
  export let filters: StringFilterTerm[];

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

<MovableWindow title="Filters" onClose={() => (showFilterWindow = false)}>
  <div class="flex-col flex-gap">
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
