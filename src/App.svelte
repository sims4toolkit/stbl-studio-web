<script lang="ts">
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { activeWorkspace } from "./services/stores";
  import StorageService from "./services/storage";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import HelpPage from "./components/pages/help/HelpPage.svelte";
  import ProjectPage from "./components/pages/project/ProjectPage.svelte";
  import BlurOverlay from "./components/layout/BlurOverlay.svelte";
  import Workspace from "./models/workspace";
  import OnboardingView from "./components/views/OnboardingView.svelte";

  let onboardUser = false;
  let restoreError = false;

  onMount(() => {
    if (StorageService.settings.hasWorkspace) {
      Workspace.restoreFromStorage()
        .then((workspace) => {
          activeWorkspace.set(workspace);
        })
        .catch((error) => {
          console.error(error);
          restoreError = true;
        });
    } else {
      onboardUser = true;
    }
  });

  const routes = {
    "/": HomePage,
    "/help": HelpPage,
    "/project/:id": ProjectPage,
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
  <div class="main-content-wrapper">
    <Router {routes} />
  </div>
  <Footer />
</main>
{#if restoreError}
  <BlurOverlay>
    <div slot="content">
      <h2>Well, this is awkward...</h2>
      <p>
        An error occurred and your workspace could not be restored. Do not worry
        - your data is most likely safe, and this is just an error on the front
        end. Please reach out to Frank either
        <a href="https://discord.gg/qNhD3Jh" target="_blank">on Discord</a> or
        by opening an issue
        <a
          href="https://github.com/sims4toolkit/stbl-studio-web/issues"
          target="_blank">on GitHub</a
        >, and he can help you get your projects back.
      </p>
      <p>If you're more tech-savvy, you can try the following:</p>
      <ol>
        <li>Open your browser's developer tools.</li>
        <li>Check Local Storage (under "Application").</li>
        <li>Look for long, Base64-encoded strings. These are your STBLs.</li>
      </ol>
    </div>
    <div slot="actions">
      <span class="button" on:click={() => (restoreError = false)}>Got it</span>
    </div>
  </BlurOverlay>
{:else if onboardUser}
  <BlurOverlay>
    <OnboardingView
      slot="content"
      exitOnboarding={() => (onboardUser = false)}
    />
  </BlurOverlay>
{/if}

<style lang="scss">
  main {
    .main-content-wrapper {
      min-height: 100vh;
    }
  }
</style>
