<script lang="ts">
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import Workspace from "src/lib/models/workspace";
  import Settings from "src/lib/services/settings";
  import HomeActionButtons from "./views/HomeActionButtons.svelte";
  import OnboardingView from "./views/OnboardingView.svelte";

  let workspace: Workspace;
  let showingProjects = false;
  let isOnboarding = false;

  if (Settings.hasWorkspace) {
    Workspace.fromStorage()
      .then((wk) => {
        workspace = wk;
        showingProjects = wk.projects.length > 0;
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    isOnboarding = true;
  }

  function onOnboardingComplete() {
    workspace = new Workspace();
    Settings.hasWorkspace = true;
    isOnboarding = false;
  }
</script>

<div class="w-100 flex justify-center" class:flex-1={!showingProjects}>
  {#if showingProjects}
    <div class="w-full xl:max-w-screen-xl px-4 py-12">
      <div class="flex justify-between mb-8">
        <SectionHeader title="My Workspace" />
        <div>
          <p class="text-sm">SELECT</p>
        </div>
      </div>
      <p>Has workspace</p>
    </div>
  {:else}
    <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
      {#if Boolean(workspace)}
        <div class="mb-8">
          <SectionHeader title="Your workspace is empty" />
        </div>
        <p class="mb-4">
          Create a new project with the toolbar in the bottom-right corner.
        </p>
        <p>Need help? Check out the help page for more information.</p>
      {:else}
        <h1
          class="text-2xl font-bold text-center text-gray-400 dark:text-gray-500"
        >
          Loading workspace...
        </h1>
      {/if}
    </div>
  {/if}
</div>

<HomeActionButtons inModal={false} inSelectMode={false} numSelected={0} />

{#if isOnboarding}
  <BlurOverlay>
    <OnboardingView {onOnboardingComplete} />
  </BlurOverlay>
{/if}
