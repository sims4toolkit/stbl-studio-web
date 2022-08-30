<script lang="ts">
  import { fade } from "svelte/transition";
  import type Project from "src/lib/models/project";
  import type LocalizedStringTable from "src/lib/models/localized-stbl";
  import {
    ParsedFilesResult,
    resolveStringTables,
  } from "src/lib/utilities/uploading";
  import Settings from "src/lib/services/settings";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageStblUploadContent from "src/components/views/MultipageStblUploadContent.svelte";
  import Switch from "src/components/elements/Switch.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let onComplete: () => void;

  let previewingLocale = project.stbl.primaryLocale;
  let overwriteKeys = false;
  let numRepeatedKeys = 0;
  let resolvingResult = false;
  let resolvedStbl: LocalizedStringTable;
  let parseResult: ParsedFilesResult = null; // null to silence svelte error
  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: false,
  };

  $: {
    if (multipageState.currentPage === 3 && !resolvingResult) {
      resolvingResult = true;
      resolveResult();
    }
  }

  async function resolveResult() {
    try {
      const stbl = await resolveStringTables(
        project.stbl.primaryLocale,
        parseResult.stbls
      );

      const existingKeys = project.stbl.keyMap;
      const importedKeys = stbl.keyMap;
      importedKeys.forEach((_, key) => {
        if (existingKeys.has(key)) ++numRepeatedKeys;
      });

      stbl.entries.forEach((entry) => {
        if (existingKeys.has(entry.key)) {
          const id = existingKeys.get(entry.key);
          const existingEntry = project.stbl.getEntry(id);
          entry.values.forEach((value, locale) => {
            const existingValue = existingEntry.values.get(locale);
            if (existingValue && !value)
              entry.values.set(locale, existingValue);
          });
        }
      });

      resolvedStbl = stbl;
    } catch (err) {
      console.error(err);

      alert(
        "An exception was thrown while resolving your string tables. Check the console for the call stack, and please let me know about this issue ASAP."
      );

      onComplete();
    }
  }

  function importStrings() {
    project.importEntries(resolvedStbl, overwriteKeys);
    project = project;
    onComplete();
  }
</script>

<MultipageContentGroup
  title="Import Strings"
  numPages={3}
  minimumContentHeight="230"
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Import"
  canClickBack={false}
  onLastPageComplete={importStrings}
>
  <div slot="content" class="w-full">
    <MultipageStblUploadContent
      startingPageNumber={1}
      bind:multipageState
      bind:parseResult
    />
    <MultipageContent pageNumber={3} bind:state={multipageState}>
      <div
        class="flex flex-col gap-6"
        in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
      >
        {#if Boolean(resolvedStbl)}
          <div>
            <div
              class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <p>
                Importing {resolvedStbl.numEntries} string(s) in {resolvedStbl.numLocales}
                locale(s).
              </p>
              <LocaleSelect
                bind:selected={previewingLocale}
                alignRight={true}
                localesToChoose={resolvedStbl.allLocales}
              />
            </div>
            <div class="my-6 max-h-24 overflow-x-hidden overflow-y-auto">
              <ul class="list-disc pl-8 flex flex-col">
                {#each resolvedStbl.entries as entry, key (key)}
                  <li class="px-2 max-w-max">
                    <p
                      class="whitespace-nowrap text-ellipsis overflow-x-hidden"
                    >
                      <span
                        class="text-accent-primary-light dark:text-accent-primary-dark hacker-text-lime monospace"
                        >{formatStringKey(entry.key)}</span
                      >
                      = {@html (() => {
                        const value = entry.values.get(previewingLocale);

                        return value
                          ? value
                          : '<span class="text-subtle">Empty string.</span>';
                      })()}
                    </p>
                  </li>
                {/each}
              </ul>
            </div>
            {#if numRepeatedKeys > 0}
              <p class="text-subtle text-xs mb-4">
                <span class="text-red-600 dark:text-red-400 font-bold"
                  >WARNING:</span
                >
                {numRepeatedKeys} entries have keys that are already in use. You
                can either add them as-is, or overwrite the existing ones.
              </p>
              <div class="whitespace-nowrap max-w-min">
                <Switch label="Overwrite keys" bind:checked={overwriteKeys} />
              </div>
            {/if}
          </div>
        {:else}
          <p>Resolving string tables...</p>
          <p class="text-xs text-subtle">
            This shouldn't take long. If you're stuck on this page, something
            likely went wrong. Please reload and try again.
          </p>
        {/if}
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
