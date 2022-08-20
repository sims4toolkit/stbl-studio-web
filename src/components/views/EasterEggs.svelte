<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Settings, {
    mainframeHackedStore,
    prideFlagOverlayStore,
    rickGifStore,
  } from "src/lib/services/settings";
  import constants from "src/data/constants.json";
  import HackedMainframeEffect from "src/components/effects/HackedMainframeEffect.svelte";
  import PrideFlagEffect from "../effects/PrideFlagEffect.svelte";

  let mainframeHacked = Settings.mainframeHacked;
  let rickGif = Settings.rickGif;
  let prideFlagOverlay = false;

  const subscriptions = [
    mainframeHackedStore.subscribe((value) => {
      mainframeHacked = value;
    }),
    rickGifStore.subscribe((value) => {
      rickGif = value;
    }),
    prideFlagOverlayStore.subscribe((value) => {
      prideFlagOverlay = value;
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

{#if prideFlagOverlay}
  <PrideFlagEffect />
{/if}
