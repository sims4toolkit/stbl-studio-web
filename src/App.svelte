<script lang="ts">
  import { onDestroy } from "svelte";
  import Router, { replace } from "svelte-spa-router";
  import Settings, { mainframeHackedStore } from "src/lib/services/settings";
  import Navbar from "src/components/views/Navbar.svelte";
  import Footer from "src/components/views/Footer.svelte";
  import HackedMainframeEffect from "src/components/effects/HackedMainframeEffect.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import HomePage from "src/pages/home/HomePage.svelte";
  import ProjectPage from "src/pages/project/ProjectPage.svelte";

  let mainframeHacked = Settings.mainframeHacked;

  const subscriptions = [
    mainframeHackedStore.subscribe((value) => {
      mainframeHacked = value;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  const routes = {
    "/": HomePage,
    "/project/:uuid": ProjectPage,
    "*": NotFoundPage,
  };

  const redirects = {
    "/batch-fix/pronounts": "/tools/pronouns",
  };

  function routeLoaded(event: any) {
    const { location } = event.detail;
    if (location in redirects) replace(redirects[location]);
  }
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} on:routeLoaded={routeLoaded} />
</main>
<Footer />

{#if mainframeHacked}
  <HackedMainframeEffect />
{/if}
