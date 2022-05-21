<script lang="ts">
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import StorageService from "./services/storage";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import HelpPage from "./components/pages/help/HelpPage.svelte";
  import ProjectPage from "./components/pages/project/ProjectPage.svelte";
  import BlurOverlay from "./components/layout/BlurOverlay.svelte";

  let showOverlay = false;

  onMount(() => {
    const hasWorkspace = StorageService.settings.hasWorkspace;
    if (!hasWorkspace) {
      setTimeout(() => {
        showOverlay = true;
        StorageService.settings.hasWorkspace = true;
      }, 200);
    }
  });

  // https://github.com/ItalyPaleAle/svelte-spa-router
  const routes = {
    "/": HomePage,
    "/help": HelpPage,
    "/project/:id": ProjectPage,
    "*": NotFoundPage,
  };

  // FIXME: is this needed?
  window.addEventListener("hashchange", function (event) {
    if (event.oldURL || event.newURL) {
      window.scrollTo(0, 0);
    }
  });
</script>

<Navbar />
<main>
  <div class="main-content-wrapper">
    <Router {routes} />
  </div>
  <Footer />
</main>
{#if showOverlay}
  <BlurOverlay>
    <div slot="content">
      <h2>Welcome, stranger!</h2>
      <p>
        It looks like you're new here, so please note that Sims 4 Toolkit is in
        early development. There may be some bugs, some features may be missing,
        and the documentation may change frequently. Keep in mind that breaking
        changes may occur until version 1.0.0 is released.
      </p>
    </div>
    <div slot="actions">
      <span class="button" on:click={() => (showOverlay = false)}>Got it</span>
    </div>
  </BlurOverlay>
{/if}

<style lang="scss">
  main {
    .main-content-wrapper {
      min-height: 100vh;
    }
  }
</style>
