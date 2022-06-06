<script lang="ts">
  import { fade } from "svelte/transition";
  import type { StringEntry } from "@s4tk/models/types";
  import { getLocaleData } from "../../../typescript/helpers/localization";
  import type Project from "../../../typescript/models/project";
  import LocaleSelect from "../../shared/controls/LocaleSelect.svelte";
  import Checkbox from "../../shared/elements/Checkbox.svelte";
  import StringTranslateCell from "./StringTranslateCell.svelte";
  import { Settings } from "../../../typescript/storage";

  export let project: Project;
  export let entries: StringEntry[];
  export let currentSlice: StringEntry[];

  let showKeys = Settings.showTranslateKeys;
  let hideTranslated = false;
  let otherLocale =
    project.primaryLocale === project.translatingTo
      ? project.allLocales.find((locale) => locale !== project.primaryLocale)
      : project.translatingTo;

  let otherStbl = project.stblMap.get(otherLocale);
  let showTranslationView = true;

  $: {
    Settings.showTranslateKeys = showKeys;
  }

  let primaryLocaleName = getLocaleData(project.primaryLocale).englishName;
  $: otherLocaleName = getLocaleData(otherLocale)?.englishName;

  $: {
    otherStbl = project.stblMap.get(otherLocale);

    if (hideTranslated) {
      entries = entries.filter((entry) => !otherStbl.hasKey(entry.key));
    } else {
      entries = project.primaryStbl.entries;
    }

    project.translatingTo = otherLocale;
    project.saveMetaData();
  }

  let lastLocale = otherLocale;
  $: {
    // this is weird. i know this is weird. but svelte is weird, and svelte
    // needs me to be weird so that it can stop being weird
    if (lastLocale !== otherLocale) {
      showTranslationView = false;
      hideTranslated = false;
      lastLocale = otherLocale;
      setTimeout(() => {
        showTranslationView = true;
      }, 500);
    }
  }
</script>

<div class="translate-view flex-col flex-gap">
  {#if Boolean(otherStbl)}
    <div class="flex-space-between flex-center-v flex-wrap flex-gap">
      <div class="flex flex-gap">
        <Checkbox label="Show keys" bind:checked={showKeys} />
        <Checkbox
          label="Hide translated strings"
          bind:checked={hideTranslated}
        />
      </div>
      <LocaleSelect
        name="translation-locale-select"
        label="translate to"
        bind:selectedLocale={otherLocale}
        include={project.allLocales}
        exclude={[project.primaryLocale]}
      />
    </div>
    <p class="subtle-text mt-0 mb-1">
      {primaryLocaleName} is on the left, and {otherLocaleName} is on the right.
      Type your translations, and they will be autosaved when you click out of the
      text box. If a string is the same in both languages, there is no need to translate
      it - {primaryLocaleName} strings will be used to fill all missing {otherLocaleName}
      strings when you download.
    </p>
    {#if showTranslationView}
      {#if Boolean(currentSlice)}
        {#each currentSlice as entry (entry.id)}
          <StringTranslateCell bind:project {showKeys} {otherStbl} {entry} />
        {/each}
      {/if}
    {:else}
      <div in:fade class="flex-center flex-col w-100 py-3 px-1 text-center">
        <h3>Refreshing...</h3>
      </div>
    {/if}
  {:else}
    <div class="flex-center flex-col empty-stbl py-3 px-1 text-center">
      <h3>No Languages to Translate</h3>
      <p>Add other locales to this project at the top of this page.</p>
    </div>
  {/if}
</div>

<style lang="scss">
  .empty-stbl {
    width: 100%;
    border: 4px dashed var(--color-divider);
    border-radius: 12px;

    h3,
    p {
      color: var(--color-text-subtle) !important;
    }
  }
</style>
