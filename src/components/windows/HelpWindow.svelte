<script lang="ts">
  // import Settings from "src/lib/services/settings";
  import helpMenuData from "src/data/help-menu.json";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import HelpRoute from "../help/HelpRoute.svelte";

  export let onClose: () => void;
  export let args: { route?: string } = {};

  $: route = args.route ?? "/";
  $: routeData = helpMenuData.routes[route];
</script>

<MovableWindow title="Help" {onClose}>
  <div class="flex flex-col gap-4">
    <!-- <div>
      <p>Found {Settings.foundEasterEggs.length} of 4 easter eggs.</p>
    </div> -->
    <HelpRoute {routeData} />
  </div>
</MovableWindow>
