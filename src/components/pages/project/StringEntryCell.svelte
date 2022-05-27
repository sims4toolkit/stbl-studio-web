<script lang="ts">
  import { formatStringKey } from "@s4tk/hashing/formatting";

  import TextInput from "../../shared/elements/TextInput.svelte";

  export let mode: "view" | "edit" | "select" = "view";
  export let stringEntry: { key: number; value: string };
</script>

<div class="string-entry-cell w-100 flex-center-v flex-gap px-1">
  {#if mode === "select"}
    <div>hi</div>
  {/if}
  <p class="monospace">{formatStringKey(stringEntry.key)}</p>
  <!-- TODO: needs unique name -->

  <input
    type="text"
    class="input-height w-100"
    placeholder={"{0.SimFirstName} is reticulating {0.SimPronounPossessiveDependent} splines!"}
    readonly={true}
    tabindex="-1"
  />

  <button class="button-wrapper">
    <img src="./assets/copy.svg" alt="Copy" class="is-svg" />
  </button>
  <button class="button-wrapper">
    <img src="./assets/pencil.svg" alt="Edit" class="is-svg" />
  </button>
</div>

<style lang="scss">
  .string-entry-cell {
    background-color: var(--color-bg-secondary);
    border-radius: 8px;

    input,
    input:focus {
      border: none;
      pointer-events: none;
      cursor: text;
    }

    img {
      height: 18px;
      width: auto;
    }
  }
</style>
