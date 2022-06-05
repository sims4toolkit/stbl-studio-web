<script lang="ts">
  import type { StringEntry } from "@s4tk/models/types";
  import type Project from "../../../typescript/models/project";
  import LocaleSelect from "../../shared/controls/LocaleSelect.svelte";
  import Checkbox from "../../shared/elements/Checkbox.svelte";
  import StringTranslateCell from "./StringTranslateCell.svelte";

  export let project: Project;
  export let entries: StringEntry[];
  export let currentSlice: StringEntry[];

  let showKeys = false;
  let hideTranslated = false;
  let otherLocale = project.allLocales.find(
    (locale) => locale !== project.primaryLocale
  );

  $: otherStbl = project.stblMap.get(otherLocale);

  $: {
    if (otherLocale != null) entries = project.primaryStbl.entries;

    if (hideTranslated)
      entries = entries.filter((entry) => !otherStbl.hasKey(entry.key));
  }
</script>

<div class="translate-view flex-col flex-gap">
  <div class="flex-space-between flex-center-v flex-wrap flex-gap mb-2">
    <div class="flex flex-gap">
      <Checkbox label="Show keys" bind:checked={showKeys} />
      <Checkbox label="Skip translated strings" bind:checked={hideTranslated} />
    </div>
    <LocaleSelect
      name="translation-locale-select"
      label="translate to"
      bind:selectedLocale={otherLocale}
      include={project.allLocales}
      exclude={[project.primaryLocale]}
    />
  </div>
  {#if Boolean(currentSlice)}
    {#each currentSlice as entry (entry.id)}
      <StringTranslateCell bind:project {showKeys} {otherStbl} {entry} />
    {/each}
  {/if}
</div>

<style lang="scss">
  // intentionally blank
</style>
