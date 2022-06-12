<script lang="ts">
  import type PossibleReplacements from "../../../../data/pronoun-replacements.json";
  import Checkbox from "../../../shared/elements/Checkbox.svelte";
  export let possibleReplacements: typeof PossibleReplacements;
</script>

<div class="mt-2 mb-3">
  <p class="small-title mt-0">Pronouns to Replace</p>
  <div class="flex-center-v wrap">
    {#each possibleReplacements as checkable, key (key)}
      <div class="mr-1">
        <Checkbox
          label={checkable.male + "/" + checkable.female}
          bind:checkable
        />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .wrap {
    flex-wrap: wrap;
  }
</style>
