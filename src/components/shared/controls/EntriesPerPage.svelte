<script lang="ts">
  import { fade } from "svelte/transition";
  import { Settings } from "../../../typescript/storage";
  import Checkbox from "../elements/Checkbox.svelte";
  import NumberInput from "../elements/NumberInput.svelte";

  let entriesPerPage = Settings.entriesPerPage;
  let showAllEntries = Settings.showAllStrings;

  $: {
    showAllEntries;
    valueChanged();
  }

  function valueChanged() {
    entriesPerPage = Math.min(100, Math.max(1, Math.round(entriesPerPage)));
    Settings.entriesPerPage = entriesPerPage;
    Settings.showAllStrings = showAllEntries;
  }
</script>

<div>
  <p class="mt-0 mb-half small-title">entries per page</p>
  <div class="flex-center-v flex-space-between">
    <NumberInput
      disabled={showAllEntries}
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
  {#if showAllEntries}
    <p class="subtle-text error-color" transition:fade>
      Showing all strings may cause lag.
    </p>
  {/if}
</div>
