<script lang="ts">
  import Router, { replace } from "svelte-spa-router";
  import Navbar from "src/components/views/Navbar.svelte";
  import Footer from "src/components/views/Footer.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import HomePage from "src/pages/HomePage.svelte";

  const routes = {
    "/": HomePage,
    "*": NotFoundPage,
  };

  function routeLoaded(event: any) {
    // redirects
    if (event.detail.location === "/batch-fix/pronouns") {
      replace("/tools/pronouns");
    }
  }
</script>

<Navbar />
<main class="min-h-screen pt-10">
  <Router {routes} restoreScrollState={true} on:routeLoaded={routeLoaded} />
</main>
<Footer />
