<script lang="ts">
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import StblListViewCell from "src/pages/project/views/StblListView.svelte";
  import StblGridView from "src/pages/project/views/StblGridView.svelte";
  import StblJsonView from "../views/StblJsonView.svelte";
  import SelectModeToggle from "src/components/controls/SelectModeToggle.svelte";

  export let project: Project;
  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  const emptyArgs = {};
  let chosenViewIndex = 0;
  let chosenViewArgs: object = emptyArgs;

  const viewOptions: {
    name: string;
    icon: string;
    component: any; // idk what type to use for components, all cause errors...
    getArgs: () => object;
  }[] = [
    {
      name: "List",
      icon: "list-outline",
      component: StblListViewCell,
      getArgs: () => emptyArgs,
    },
    {
      name: "Grid",
      icon: "grid-outline",
      component: StblGridView,
      getArgs: () => emptyArgs,
    },
    {
      name: "JSON",
      icon: "curly-braces",
      component: StblJsonView,
      getArgs: () => emptyArgs,
    },
  ];

  $: chosenView = viewOptions[chosenViewIndex];
</script>

<div class="flex flex-col gap-8">
  <div class="w-full flex justify-between items-center">
    <div class="flex flex-col gap-2">
      <p class="text-subtle text-sm uppercase font-bold">
        {chosenView.name} VIEW
      </p>
      <div class="flex gap-2">
        {#each viewOptions as option, index (index)}
          <button
            class="flex items-center justify-center p-2 rounded-full border border-gray-400 dark:border-gray-500 hover:bg-gray-300 hover:dark:bg-gray-700"
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
      <SelectModeToggle bind:selectionGroup />
    </div>
  </div>
  <div class="w-full">
    <svelte:component
      this={chosenView.component}
      bind:project
      {...chosenViewArgs}
    />
  </div>
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
