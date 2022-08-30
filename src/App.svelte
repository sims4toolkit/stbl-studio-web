<script lang="ts">
  import Router, { replace } from "svelte-spa-router";
  import Navbar from "src/components/views/Navbar.svelte";
  import Footer from "src/components/views/Footer.svelte";
  import EasterEggs from "src/components/views/EasterEggs.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import HomePage from "src/pages/home/HomePage.svelte";
  import ProjectPage from "src/pages/project/ProjectPage.svelte";
  import PronounToolPage from "src/pages/pronouns/PronounToolPage.svelte";

  const routes = {
    "/": HomePage,
    "/project/:uuid": ProjectPage,
    "/tools/pronouns": PronounToolPage,
    "*": NotFoundPage,
  };

  const redirects = {
    "/batch-fix/pronouns": "/tools/pronouns",
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

<EasterEggs />
