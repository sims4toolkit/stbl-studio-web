<script lang="ts">
  import { onDestroy } from "svelte";
  import Workspace from "src/lib/models/workspace";
  import type Project from "src/lib/models/project";
  import SelectionGroup from "src/lib/models/selection-group";
  import Settings from "src/lib/services/settings";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import HomeActionButtons from "./controls/HomeActionButtons.svelte";
  import OnboardingView from "./views/OnboardingView.svelte";
  import WorkspaceView from "./views/WorkspaceView.svelte";

  let activeWorkspace: Workspace;
  let showingProjects = false;
  let isOnboarding = false;
  let selectionGroup: SelectionGroup<Project, string>;

  const subscriptions = [
    activeWorkspaceStore.subscribe((workspace) => {
      if (workspace) {
        activeWorkspace = workspace;
        showingProjects = workspace.projects.length > 0;
        selectionGroup = new SelectionGroup(workspace.projects, "uuid", () => {
          selectionGroup = selectionGroup;
        });
      }
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  if (Settings.hasWorkspace) {
    Workspace.fromStorage()
      .then((workspace) => {
        activeWorkspaceStore.set(workspace);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    isOnboarding = true;
  }

  function onOnboardingComplete() {
    Settings.hasWorkspace = true;
    isOnboarding = false;
  }
</script>

<section
  class="pt-10 px-4 w-full flex justify-center"
  class:flex-1={!showingProjects}
>
  {#if showingProjects}
    <div class="w-full xl:max-w-screen-xl py-12">
      <WorkspaceView bind:workspace={activeWorkspace} bind:selectionGroup />
    </div>
  {:else}
    <div class="w-full xl:max-w-screen-xl flex flex-col justify-center">
      {#if Boolean(activeWorkspace)}
        <div class="mb-8">
          <SectionHeader title="Your workspace is empty" />
        </div>
        <p class="mb-4">
          Create a new project with the toolbar in the bottom-right corner.
        </p>
        <p>Need help? Check out the help page for more information.</p>
      {:else}
        <h1
          class="text-2xl font-bold text-center drop-shadow text-gray-400 dark:text-gray-500"
        >
          Loading workspace...
        </h1>
      {/if}
    </div>
  {/if}
</section>

{#if selectionGroup !== undefined}
  <HomeActionButtons bind:selectionGroup />
{/if}

{#if isOnboarding}
  <BlurOverlay>
    <OnboardingView {onOnboardingComplete} />
  </BlurOverlay>
{/if}
