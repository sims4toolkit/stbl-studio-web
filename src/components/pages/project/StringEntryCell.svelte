<script lang="ts">
  import TextInput from "../../shared/elements/TextInput.svelte";

  export let mode: "view" | "edit" | "select" = "view";
  export let stringEntry: { key: number; value: string };
</script>

<div class="w-100 flex-center-v">
  {#if mode === "select"}
    <div>hi</div>
  {/if}
  <p>{stringEntry.key}</p>
  <!-- TODO: needs unique name -->
  <TextInput
    name="string-entry"
    placeholder={"{0.SimFirstName} is reticulating {0.SimPronounPossessiveDependent} splines!"}
    bind:value={stringEntry.value}
  />
</div>

<style lang="scss">
  // intentionally blank
</style>
