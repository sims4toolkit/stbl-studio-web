<script lang="ts">
  import Settings from "src/lib/services/settings";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import SelectModeToggle from "src/components/controls/SelectModeToggle.svelte";
  import StblListViewCell from "src/pages/project/views/StblListView.svelte";
  import StblGridView from "src/pages/project/views/StblGridView.svelte";
  import StblJsonView from "src/pages/project/views/StblJsonView.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  import PaginationController from "src/components/controls/PaginationController.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  let entries = project.stbl.entries;
  let sliceToRender: LocalizedStringEntry[] = [];

  $: {
    entries = project.stbl.entries;
  }

  type UtilitiesType = "selectable" | "json" | "translate";

  interface ViewOption {
    name: string;
    icon: string;
    component: any;
    getArgs: () => object;
    utilities: UtilitiesType;
    pagination: boolean;
  }

  const emptyArgs = {};
  const viewOptions: ViewOption[] = [
    {
      name: "List",
      icon: "list-outline",
      component: StblListViewCell,
      getArgs: () => emptyArgs,
      utilities: "selectable",
      pagination: true,
    },
    {
      name: "Grid",
      icon: "grid-outline",
      component: StblGridView,
      getArgs: () => emptyArgs,
      utilities: "selectable",
      pagination: true,
    },
    {
      name: "JSON",
      icon: "curly-braces",
      component: StblJsonView,
      getArgs: () => emptyArgs,
      utilities: "json",
      pagination: false,
    },
  ];

  let chosenViewIndex = Math.min(Settings.projectView, viewOptions.length - 1);
  let chosenView = viewOptions[chosenViewIndex];
  let translatingTo = 0;

  $: {
    chosenView = viewOptions[chosenViewIndex];
    Settings.projectView = chosenViewIndex;
  }
</script>

<div class="flex flex-col gap-8">
  <div
    class="w-full flex justify-between items-center flex-wrap sm:flex-nowrap"
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
    <div>
      {#if chosenView.utilities === "selectable"}
        <SelectModeToggle bind:selectionGroup />
      {:else if chosenView.utilities === "json"}
        <button>Save</button>
      {:else if chosenView.utilities === "translate"}
        <LocaleSelect label="translate to" bind:selected={translatingTo} />
      {/if}
    </div>
  </div>
  <div class="w-full">
    <svelte:component
      this={chosenView.component}
      bind:project
      bind:selectionGroup
      bind:sliceToRender
      {...chosenView.getArgs()}
    />
  </div>
</div>

<div hidden={!chosenView.pagination}>
  <PaginationController
    bind:items={entries}
    onSliceUpdate={(slice) => {
      sliceToRender = slice;
    }}
  />
</div>

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
