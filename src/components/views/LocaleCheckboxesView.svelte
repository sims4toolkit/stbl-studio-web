<script lang="ts">
  import type { LocaleData } from "../../global";
  import { getDisplayName } from "../../services/localization";
  import Checkbox from "../shared/Checkbox.svelte";

  export let localeChoices: {
    data: LocaleData;
    checked: boolean;
  }[];

  function toggleAll(checked?: boolean) {
    localeChoices.forEach((choice) => {
      choice.checked = checked;
    });

    localeChoices = localeChoices;
  }
</script>

<div class="locale-checkboxes">
  <div class="flex-center-v selection-toggles mb-1">
    <button on:click={() => toggleAll(true)}>select all</button>
    <button on:click={() => toggleAll(false)}>deselect all</button>
  </div>
  {#each localeChoices as choice, key (key)}
    <Checkbox label={getDisplayName(choice.data)} bind:checkable={choice} />
  {/each}
</div>

<style lang="scss">
  .locale-checkboxes {
    .selection-toggles {
      gap: 20px;

      button {
        border: none;
        background: none;
        color: var(--color-text);
        text-transform: uppercase;
        opacity: 0.65;
        padding: 0;

        &:hover {
          opacity: 1;
          cursor: pointer;
        }
      }
    }
  }
</style>
