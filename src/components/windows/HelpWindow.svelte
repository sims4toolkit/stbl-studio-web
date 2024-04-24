<script lang="ts">
  import Settings from "src/lib/services/settings";
  import helpMenuData from "src/data/help-menu.json";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import HelpRoute from "src/components/help/HelpRoute.svelte";

  export let onClose: () => void;
  export let args: { route?: string; suppressBack?: boolean } = {};

  $: route = args.route ?? "/";
  $: routeData = helpMenuData.routes[route] ?? helpMenuData.routes["/"];
</script>

<MovableWindow title="Help" {onClose}>
  <div class="flex-1 flex flex-col gap-4">
    {#if Boolean(routeData)}
      <HelpRoute {routeData} suppressBack={args.suppressBack ?? false} />
    {/if}
    {#if route === "/faqs"}
      <hr class="border-black dark:border-white hacker-border-gray" />
      <div>
        <h4 class="text-sm font-bold mb-2">
          Does this website have easter eggs?
        </h4>
        <p class="text-subtle text-sm">
          It was created by Frankk. Of course it does. You've found {Settings
            .foundEasterEggs.length} of 4 easter eggs.
        </p>
      </div>
    {/if}
  </div>
</MovableWindow>
