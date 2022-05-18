<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import BlurOverlay from "./components/shared/BlurOverlay.svelte";
  import { onMount } from "svelte";
  import HelpPage from "./components/pages/help/HelpPage.svelte";

  let showOverlay = false;

  onMount(() => {
    const hasBeenOnboarded = localStorage.getItem("hasBeenOnboarded");
    if (!hasBeenOnboarded) {
      setTimeout(() => {
        showOverlay = true;
        localStorage.setItem("hasBeenOnboarded", "true");
      }, 200);
    }
  });

  // https://github.com/ItalyPaleAle/svelte-spa-router
  const routes = {
    "/": HomePage,
    "/help": HelpPage,
    "*": NotFoundPage,
  };

  window.addEventListener("hashchange", function (event) {
    if (event.oldURL || event.newURL) {
      window.scrollTo(0, 0);
    }
  });
</script>

<Navbar />
<main>
  <Router {routes} />
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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
