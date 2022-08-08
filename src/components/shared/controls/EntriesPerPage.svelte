<script lang="ts">
  import { Settings } from "../../../typescript/storage";
  import {
    entriesPerPageStore,
    showAllStringsStore,
  } from "../../../typescript/stores";
  import Checkbox from "../elements/Checkbox.svelte";
  import NumberInput from "../elements/NumberInput.svelte";

  let entriesPerPage = Settings.entriesPerPage;
  let showAllStrings = Settings.showAllStrings;

  $: {
    showAllStrings;
    valueChanged();
  }

  function valueChanged() {
    entriesPerPage = Math.min(100, Math.max(1, Math.round(entriesPerPage)));
    entriesPerPageStore.set(entriesPerPage);
    showAllStringsStore.set(showAllStrings);
  }
</script>

<div>
  <p class="mt-0 mb-half small-title">entries per page</p>
  <div class="flex-center-v flex-space-between">
    <NumberInput
      disabled={showAllStrings}
      name="entries-per-page-input"
      bind:value={entriesPerPage}
      subtleBorder={true}
      min={1}
      max={100}
      fillWidth={true}
      onBlur={valueChanged}
    />
    <Checkbox
      bind:checked={showAllStrings}
      label="Show All"
      fillAndCenter={true}
    />
  </div>
  {#if showAllStrings}
    <p class="subtle-text error-color">
      <strong class="error-color">WARNING</strong>: Large STBLs might freeze or
      lag.
    </p>
  {/if}
</div>
