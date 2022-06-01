<script lang="ts">
  import type { StringEntry } from "@s4tk/models/types";
  import type Project from "../../../typescript/models/project";
  import LocaleSelect from "../../shared/controls/LocaleSelect.svelte";
  import Checkbox from "../../shared/elements/Checkbox.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let entries: StringEntry[];
  export let currentSlice: StringEntry[];

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
  <div class="flex-space-between flex-center-v mb-2">
    <Checkbox label="Skip translated strings" bind:checked={hideTranslated} />
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
      <div class="translate-entry floating-card drop-shadow">
        <SplitView>
          <div slot="left">
            <p class="monospace accent-color my-0">
              {formatStringKey(entry.key)}
            </p>
            <p class="mb-0">{entry.value}</p>
          </div>
          <div slot="right">
            <p>{otherStbl.getByKey(entry.key)?.value}</p>
          </div>
        </SplitView>
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  // intentionally blank
</style>
