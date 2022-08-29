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
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let onComplete: () => void;

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
      resolvedStbl = await resolveStringTables(
        project.stbl.primaryLocale,
        parseResult.stbls
      );
    } catch (err) {
      console.error(err);

      alert(
        "An exception was thrown while resolving your string tables. Check the console for the call stack, and please let me know about this issue ASAP."
      );

      onComplete();
    }
  }

  function importStrings() {
    // TODO:

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
            <p>
              You're about to import the following {resolvedStbl.numEntries} string(s)
              in {resolvedStbl.numLocales}
              locale(s).
            </p>
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
                      = {entry.values.get(resolvedStbl.primaryLocale)}
                    </p>
                  </li>
                {/each}
              </ul>
            </div>
            <p class="text-subtle text-xs">
              This action cannot be undone. Are you sure you want to continue?
            </p>
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
