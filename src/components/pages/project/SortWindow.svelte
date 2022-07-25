<script lang="ts">
  import SortOrder from "../../../typescript/enums/sort-order";
  import Select from "../../shared/elements/Select.svelte";
  import MovableWindow from "../../shared/layout/MovableWindow.svelte";

  export let showSortWindow: boolean;
  export let selectedSortOrder: SortOrder;

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
</script>

<MovableWindow title="Sort" onClose={() => (showSortWindow = false)}>
  <div class="flex-col flex-gap">
    <Select
      name="sort-select"
      bind:selected={selectedSortOrder}
      options={sortOptions}
      subtleBorder={true}
      fillWidth={true}
    />
  </div>
</MovableWindow>
