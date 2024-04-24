<script lang="ts">
  import WindowManager from "src/lib/services/windows";
  import HelpContentDelegate from "./HelpContentDelegate.svelte";

  export let routeData: HelpRouteData;
  export let suppressBack: boolean = false;

  $: hasBackButton = Boolean(routeData.backButtonLink) && !suppressBack;

  const goBack = () =>
    WindowManager.request("help", "open", {
      route: routeData.backButtonLink,
    });
</script>

<div class="flex justify-between whitespace-nowrap">
  {#if hasBackButton}
    <button
      class="w-12 text-subtle flex gap-2 items-center text-xs"
      on:click={goBack}
    >
      <img class="svg h-2" src="./assets/chevron-left.svg" alt="<" />
      Back
    </button>
  {/if}
  <h4 class="text-sm text-center font-bold" class:w-full={!hasBackButton}>
    {routeData.title}
  </h4>
  {#if hasBackButton}
    <div class="w-12" />
  {/if}
</div>

{#each routeData.content as data, key (key)}
  <HelpContentDelegate {data} />
{/each}
