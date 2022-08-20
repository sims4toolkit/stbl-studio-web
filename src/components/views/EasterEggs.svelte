<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Settings, {
    mainframeHackedStore,
    rickGifStore,
  } from "src/lib/services/settings";
  import constants from "src/data/constants.json";
  import HackedMainframeEffect from "src/components/effects/HackedMainframeEffect.svelte";

  let mainframeHacked = Settings.mainframeHacked;
  let rickGif = Settings.rickGif;

  const subscriptions = [
    mainframeHackedStore.subscribe((value) => {
      mainframeHacked = value;
    }),
    rickGifStore.subscribe((value) => {
      rickGif = value;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });
</script>

{#if mainframeHacked}
  <HackedMainframeEffect />
{/if}

{#if rickGif}
  <a
    class="fixed bottom-0 left-4 z-50"
    href={constants.links.rickRoll}
    target="_blank"
    transition:fly={{ y: 200, duration: 3500 }}
  >
    <img
      class="h-48"
      src="https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif"
      alt="Rick"
    />
  </a>
{/if}
