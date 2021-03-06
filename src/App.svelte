<script lang="ts">
  import { onMount } from "svelte";
  import Router, { replace } from "svelte-spa-router";
  import { activeWorkspace, isLightThemeStore } from "./typescript/stores";
  import { Settings } from "./typescript/storage";
  import Workspace from "./typescript/models/workspace";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import BlurOverlay from "./components/shared/layout/BlurOverlay.svelte";
  import OnboardingView from "./components/views/OnboardingView.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import HelpPage from "./components/pages/help/HelpPage.svelte";
  import ProjectPage from "./components/pages/project/ProjectPage.svelte";
  import SettingsPage from "./components/pages/settings/SettingsPage.svelte";
  import PronounToolPage from "./components/pages/tools/pronouns/PronounToolPage.svelte";
  import ToolsPage from "./components/pages/tools/ToolsPage.svelte";
  import HasherToolPage from "./components/pages/tools/hasher/HasherToolPage.svelte";

  let onboardUser = false;
  let restoreError = false;

  onMount(() => {
    if (Settings.hasWorkspace) {
      Workspace.restoreFromStorage()
        .then((workspace) => {
          activeWorkspace.set(workspace);
        })
        .catch((err) => {
          console.error(err);
          restoreError = true;
        });
    } else {
      onboardUser = true;
    }
  });

  const routes = {
    "/": HomePage,
    "/help": HelpPage,
    "/settings": SettingsPage,
    "/project/:uuid": ProjectPage,
    "/tools": ToolsPage,
    "/tools/pronouns": PronounToolPage,
    "/tools/hasher": HasherToolPage,
    "*": NotFoundPage,
  };

  function routeLoaded(event: any) {
    // redirects
    if (event.detail.location === "/batch-fix/pronouns") {
      replace("/tools/pronouns");
    }
  }

  let storageSyncTimeout: any;

  function startStorageSyncTimeout() {
    storageSyncTimeout = setTimeout(async () => {
      if (Settings.hasWorkspace) {
        onboardUser = false;
        activeWorkspace.set(await Workspace.restoreFromStorage());
        isLightThemeStore.set(Settings.isLightTheme);
      } else {
        onboardUser = true;
        activeWorkspace.set(undefined);
      }
    }, 500);
  }

  window.addEventListener("storage", async () => {
    if (storageSyncTimeout === undefined) {
      startStorageSyncTimeout();
    } else {
      clearTimeout(storageSyncTimeout);
      startStorageSyncTimeout();
    }
  });
</script>

<Navbar />
<main>
  <div class="main-content-wrapper">
    <Router {routes} restoreScrollState={true} on:routeLoaded={routeLoaded} />
  </div>
  <Footer />
</main>
{#if restoreError}
  <BlurOverlay>
    <div>
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
  </BlurOverlay>
{:else if onboardUser}
  <BlurOverlay>
    <OnboardingView exitOnboarding={() => (onboardUser = false)} />
  </BlurOverlay>
{/if}

<style lang="scss">
  main {
    .main-content-wrapper {
      min-height: 100vh;
    }
  }
</style>
