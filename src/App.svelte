<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "./components/app/Navbar.svelte";
  import Footer from "./components/app/Footer.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import PronounBatchFix from "./components/pages/batch/PronounBatchFix.svelte";
  import TemporaryHomePage from "./components/pages/batch/TemporaryHomePage.svelte";

  const routes = {
    "/": TemporaryHomePage,
    "/batch-fix/pronouns": PronounBatchFix,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main>
  <div class="main-content-wrapper">
    <Router {routes} />
  </div>
  <Footer />
</main>

<style lang="scss">
  main {
    .main-content-wrapper {
      min-height: 100vh;
    }
  }
</style>
