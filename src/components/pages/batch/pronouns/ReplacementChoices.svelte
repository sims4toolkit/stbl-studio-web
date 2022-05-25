<script lang="ts">
  import type PossibleReplacements from "../../../../data/pronoun-replacements.json";
  import Checkbox from "../../../elements/Checkbox.svelte";
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
  <p class="subtle-text mb-0">
    It's only necessary to replace pronouns that contain "his" or "her".
  </p>
</div>

<style lang="scss">
  .wrap {
    flex-wrap: wrap;
  }
</style>
