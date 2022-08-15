<script lang="ts">
  // import { onMount } from "svelte";
  import Router, { replace } from "svelte-spa-router";
  // import { activeWorkspace, isLightThemeStore } from "./typescript/stores";
  // import { Settings } from "./typescript/storage";
  // import Workspace from "./typescript/models/workspace";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  // import BlurOverlay from "./components/layout/BlurOverlay.svelte";
  // import OnboardingView from "./components/views/OnboardingView.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  // import HomePage from "./components/pages/home/HomePage.svelte";
  import WorkspacePage from "./components/pages/workspace/WorkspacePage.svelte";
  // import HelpPage from "./components/pages/help/HelpPage.svelte";
  // import ProjectPage from "./components/pages/project/ProjectPage.svelte";
  // import SettingsPage from "./components/pages/settings/SettingsPage.svelte";
  // import PronounToolPage from "./components/pages/tools/pronouns/PronounToolPage.svelte";
  // import ToolsPage from "./components/pages/tools/ToolsPage.svelte";
  // import HasherToolPage from "./components/pages/tools/hasher/HasherToolPage.svelte";

  const routes = {
    // "/": HomePage,
    "/workspace": WorkspacePage,
    // "/help": HelpPage,
    // "/settings": SettingsPage,
    // "/project/:uuid": ProjectPage,
    // "/tools": ToolsPage,
    // "/tools/pronouns": PronounToolPage,
    // "/tools/hasher": HasherToolPage,
    "*": NotFoundPage,
  };

  function routeLoaded(event: any) {
    // redirects
    if (event.detail.location === "/batch-fix/pronouns") {
      replace("/tools/pronouns");
    }
  }

  let storageSyncTimeout: any;

  // function startStorageSyncTimeout() {
  //   storageSyncTimeout = setTimeout(async () => {
  //     if (Settings.hasWorkspace) {
  //       onboardUser = false;
  //       activeWorkspace.set(await Workspace.restoreFromStorage());
  //       isLightThemeStore.set(Settings.isLightTheme);
  //     } else {
  //       onboardUser = true;
  //       activeWorkspace.set(undefined);
  //     }
  //   }, 500);
  // }

  // window.addEventListener("storage", async () => {
  //   if (storageSyncTimeout === undefined) {
  //     startStorageSyncTimeout();
  //   } else {
  //     clearTimeout(storageSyncTimeout);
  //     startStorageSyncTimeout();
  //   }
  // });
</script>

<Navbar />
<main>
  <div class="main-content-wrapper">
    <Router {routes} restoreScrollState={true} on:routeLoaded={routeLoaded} />
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
