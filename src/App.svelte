<script lang="ts">
  import Router, { replace } from "svelte-spa-router";
  import NotFoundPage from "./pages/NotFoundPage.svelte";
  import HomePage from "./pages/HomePage.svelte";
  import Navbar from "./components/views/Navbar.svelte";

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
<main>
  <div class="min-h-screen">
    <Router {routes} restoreScrollState={true} on:routeLoaded={routeLoaded} />
  </div>
  <!-- <Footer /> -->
</main>
