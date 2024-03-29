<script lang="ts">
  import { onDestroy } from "svelte";
  import Settings, {
    SettingsSubscriptionManager,
  } from "src/lib/services/settings";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import type {
    LocalizedStringEntry,
    LocalizedStringTableIssue,
  } from "src/lib/models/localized-stbl";
  import SelectModeToggle from "src/components/controls/SelectModeToggle.svelte";
  import StblListViewCell from "src/pages/project/views/StblListView.svelte";
  import StblGridView from "src/pages/project/views/StblGridView.svelte";
  import StblJsonView from "src/pages/project/views/StblJsonView.svelte";
  import TranslateView from "src/pages/project/views/TranslateView.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  import PaginationController from "src/components/controls/PaginationController.svelte";
  import DisplayOptionsWindow from "src/components/windows/DisplayOptionsWindow.svelte";
  import {
    FilterTerm,
    getEntriesToShow,
  } from "src/lib/utilities/string-display";
  import Switch from "src/components/elements/Switch.svelte";
  import WarningsWindow from "src/components/windows/WarningsWindow.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let entries = project.stbl.entries;
  let sliceToRender: LocalizedStringEntry[] = [];
  let filters: FilterTerm[] = [];
  let saveJson: () => boolean;
  let jsonSavedCooldown = false;
  let showWarnings = false;
  let warnings: LocalizedStringTableIssue[] = [];

  const subscriptions = [
    SettingsSubscriptionManager.subscribe("sortOrder", () => {
      project = project;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: {
    project;
    warnings = project.stbl.getIssues();
  }

  $: {
    project;
    filters;
    entries = getEntriesToShow(
      project.stbl.primaryLocale,
      project.stbl.entries,
      Settings.sortOrder,
      filters
    );
  }

  $: hidePagination = !(
    chosenView.pagination &&
    (chosenView.utilities !== "translate" ||
      (project.stbl.numLocales > 1 && project.stbl.numEntries > 0))
  );

  $: otherLocales = project.stbl.otherLocales;

  type UtilitiesType = "selectable" | "json" | "translate";

  interface ViewOption {
    name: string;
    icon: string;
    component: any;
    utilities: UtilitiesType;
    pagination: boolean;
  }

  const viewOptions: ViewOption[] = [
    {
      name: "List",
      icon: "list-outline",
      component: StblListViewCell,
      utilities: "selectable",
      pagination: true,
    },
    {
      name: "Grid",
      icon: "grid-outline",
      component: StblGridView,
      utilities: "selectable",
      pagination: true,
    },
    {
      name: "JSON",
      icon: "curly-braces",
      component: StblJsonView,
      utilities: "json",
      pagination: false,
    },
    {
      name: "Translate",
      icon: "language-outline",
      component: TranslateView,
      utilities: "translate",
      pagination: true,
    },
  ];

  let chosenViewIndex = Math.min(Settings.projectView, viewOptions.length - 1);
  let chosenView = viewOptions[chosenViewIndex];
  let translatingTo = 0;
  let showDisplayWindow = false;

  $: {
    if (otherLocales && !otherLocales.includes(translatingTo)) {
      translatingTo = otherLocales[0] ?? 0;
    }
  }

  $: {
    if (chosenView.utilities !== "selectable")
      selectionGroup.toggleSelectMode(false);
  }

  $: {
    chosenView = viewOptions[chosenViewIndex];
    Settings.projectView = chosenViewIndex;
    if (chosenView.utilities !== "json") saveJson = undefined;
  }

  function handleSaveJsonClick() {
    if (saveJson()) {
      jsonSavedCooldown = true;
      setTimeout(() => {
        jsonSavedCooldown = false;
      }, 1000);
    }
  }
</script>

<div>
  <div
    class="w-full flex justify-between sm:items-center flex-wrap sm:flex-nowrap flex-col sm:flex-row"
  >
    <div class="flex flex-col gap-2">
      <p class="text-subtle text-sm uppercase font-bold">
        {chosenView.name} VIEW
      </p>
      <div class="flex gap-2">
        {#each viewOptions as option, index (index)}
          <button
            class="flex items-center justify-center p-2 rounded-full border border-gray-400 dark:border-gray-500 hacker-border-gray hover:bg-gray-300 hover:dark:bg-gray-700 hover:hacker-bg-gray"
            title={option.name}
            class:active={index === chosenViewIndex}
            on:click={() => (chosenViewIndex = index)}
          >
            <img
              class="svg h-4"
              src="./assets/{option.icon}.svg"
              alt={option.name}
            />
          </button>
        {/each}
      </div>
    </div>
    <div class="mt-4 sm:mt-4">
      {#if chosenView.utilities === "selectable"}
        <div class="flex justify-center gap-4">
          {#if warnings.length > 0}
            <button
              class="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
              on:click={() => (showWarnings = !showWarnings)}
              >WARNINGS ({warnings.length})</button
            >
          {/if}
          <button
            class="text-sm hover:text-subtle"
            on:click={() => (showDisplayWindow = !showDisplayWindow)}
            >DISPLAY</button
          >
          <SelectModeToggle
            disabled={entries.length === 0}
            bind:selectionGroup
          />
        </div>
      {:else if chosenView.utilities === "json"}
        <button
          disabled={jsonSavedCooldown}
          class="flex mt-4 sm:mt-0 justify-center items-center text-sm gap-2 rounded py-1 w-24 default-button border border-black dark:border-white hacker-border-gray"
          class:cursor-not-allowed={jsonSavedCooldown}
          on:click={handleSaveJsonClick}
          ><img
            class="h-4"
            src="./assets/save-outline.svg"
            alt="Save"
          />{jsonSavedCooldown ? "Saved!" : "Save"}</button
        >
      {:else if chosenView.utilities === "translate" && project.metaData.numLocales > 1}
        <div class="mt-4 sm:mt-0">
          <LocaleSelect
            label="translating to"
            alignRight={true}
            bind:selected={translatingTo}
            bind:localesToChoose={otherLocales}
          />
        </div>
      {/if}
    </div>
  </div>
  {#if chosenView.utilities === "translate" && project.metaData.numLocales > 1}
    <div class="mt-4 flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8">
      <div class="max-w-min whitespace-nowrap">
        <Switch
          label="Hide String Keys"
          bind:checked={Settings.translateHideKeys}
        />
      </div>
      <!-- <div class="max-w-min whitespace-nowrap">
        <Switch
          label="Hide Translated Strings"
          bind:checked={Settings.translateHideTranslated}
        />
      </div> -->
    </div>
  {/if}
  {#if filters.length > 0}
    <div class="mt-4">
      <p class="text-xs text-subtle">
        Showing {entries.length} of {project.stbl.numEntries} entries.
        <button
          class="text-secondary underline hover:no-underline"
          on:click={() => (filters = [])}>Clear Filters</button
        >
      </p>
    </div>
  {/if}
  <div class="w-full mt-8">
    {#if chosenView.utilities === "json"}
      <svelte:component
        this={chosenView.component}
        bind:project
        bind:saveJson
      />
    {:else if chosenView.utilities === "translate"}
      <svelte:component
        this={chosenView.component}
        bind:project
        bind:locale={translatingTo}
        bind:sliceToRender
      />
    {:else}
      <svelte:component
        this={chosenView.component}
        bind:project
        bind:selectionGroup
        bind:sliceToRender
      />
    {/if}
  </div>
</div>

<div hidden={hidePagination}>
  <PaginationController
    bind:items={entries}
    onSliceUpdate={(slice) => {
      sliceToRender = slice;
    }}
  />
</div>

{#if showDisplayWindow}
  <DisplayOptionsWindow
    bind:filters
    onClose={() => (showDisplayWindow = false)}
  />
{/if}

{#if showWarnings}
  <WarningsWindow bind:warnings onClose={() => (showWarnings = false)} />
{/if}

<style lang="scss">
  button.active {
    border-color: var(--color-accent-secondary);
    background-color: var(--color-accent-secondary);
    pointer-events: none;
    cursor: default;

    img {
      filter: var(--filter-svg-invert);
    }
  }
</style>
