<script lang="ts">
  import type PossibleReplacements from "src/data/pronoun-replacements.json";
  import Checkbox from "src/components/elements/Checkbox.svelte";

  export let possibleReplacements: typeof PossibleReplacements;
</script>

<div class="mt-4 mb-6">
  <p class="text-subtle uppercase text-sm font-bold mb-4">
    Pronouns to Replace
  </p>
  <div class="flex items-center flex-wrap">
    {#each possibleReplacements as checkable, key (key)}
      <div class="mr-4">
        <Checkbox
          label={checkable.male + "/" + checkable.female}
          bind:checkable
        />
      </div>
    {/each}
  </div>
</div>
