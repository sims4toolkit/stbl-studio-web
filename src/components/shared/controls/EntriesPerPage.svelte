<script lang="ts">
  import Checkbox from "../elements/Checkbox.svelte";
  import NumberInput from "../elements/NumberInput.svelte";

  let entriesPerPage = 12;
  let showAllEntries = false;

  $: {
    showAllEntries;
    valueChanged();
  }

  function valueChanged() {
    entriesPerPage = Math.min(100, Math.max(1, Math.round(entriesPerPage)));

    console.log("hello");
  }
</script>

<div>
  <p class="mt-0 mb-half small-title">entries per page</p>
  <div class="flex-center-v flex-space-between">
    <NumberInput
      name="entries-per-page-input"
      bind:value={entriesPerPage}
      subtleBorder={true}
      min={1}
      max={100}
      fillWidth={true}
      onBlur={valueChanged}
    />
    <Checkbox
      bind:checked={showAllEntries}
      label="Show All"
      fillAndCenter={true}
    />
  </div>
</div>
