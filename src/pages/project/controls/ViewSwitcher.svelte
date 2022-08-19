<script lang="ts">
  import type Project from "src/lib/models/project";
  import StringListView from "src/pages/project/views/StringListView.svelte";
  import StringGridView from "src/pages/project/views/StringGridView.svelte";

  export let project: Project;

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
      component: StringListView,
      getArgs: () => emptyArgs,
    },
    {
      name: "Grid",
      icon: "grid-outline",
      component: StringGridView,
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
      <div class="flex gap-4">
        {#each viewOptions as option, index (index)}
          <button
            class="flex items-center justify-center p-1 rounded-full border border-gray-400 dark:border-gray-500"
            on:click={() => (chosenViewIndex = index)}
          >
            <img
              class="svg h-5"
              src="./assets/{option.icon}.svg"
              alt={option.name}
            />
          </button>
        {/each}
      </div>
    </div>
    <div>
      <button>select</button>
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
