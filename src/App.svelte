<script lang="ts">
  import Router, { replace } from "svelte-spa-router";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import HomePage from "src/pages/HomePage.svelte";
  import Navbar from "src/components/views/Navbar.svelte";

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
<main class="mt-10">
  <div class="min-h-screen">
    <Router {routes} restoreScrollState={true} on:routeLoaded={routeLoaded} />
  </div>
  <!-- <Footer /> -->
</main>
