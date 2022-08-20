<script lang="ts">
  import { onDestroy } from "svelte";
  import Settings, {
    mainframeHackedStore,
    rickGifStore,
  } from "src/lib/services/settings";
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
  <img
    class="fixed bottom-0 left-6 h-48 z-50"
    src="https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif"
    alt="Rick"
  />
{/if}
