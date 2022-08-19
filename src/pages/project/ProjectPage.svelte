<script lang="ts">
  import { onDestroy } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "src/lib/models/project";
  import Workspace from "src/lib/models/workspace";
  import SelectionGroup from "src/lib/models/selection-group";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import Settings from "src/lib/services/settings";
  import ProjectPageHeader from "./views/ProjectPageHeader.svelte";
  import ViewSwitcher from "./controls/ViewSwitcher.svelte";
  import ProjectActionButtons from "./controls/ProjectActionButtons.svelte";

  export let params: { uuid: string };

  let project: Project;
  let projectLoaded = false;
  let selectionGroup = new SelectionGroup<LocalizedStringEntry, number>(
    [],
    "key",
    () => {
      selectionGroup = selectionGroup;
    }
  ); // FIXME:

  const subscriptions = [
    activeWorkspaceStore.subscribe(async (workspace) => {
      if (workspace) {
        project = workspace.projects.find((p) => p.uuid === params.uuid);
        if (!project) {
          replace("/");
        } else {
          await project.loadStringTable();
          projectLoaded = true;
        }
      } else if (!Settings.hasWorkspace) {
        replace("/");
      } else {
        Workspace.fromStorage().then((workspace) => {
          activeWorkspaceStore.set(workspace);
        });
      }
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });
</script>

<section
  class="w-full flex flex-col justify-center overflow-x-hidden"
  class:flex-1={!projectLoaded}
>
  {#if projectLoaded}
    <ProjectPageHeader {project} />
    <div class="w-full flex justify-center px-4 py-12">
      <div class="w-full xl:max-w-screen-xl">
        <ViewSwitcher bind:project bind:selectionGroup />
      </div>
    </div>
    <ProjectActionButtons bind:selectionGroup bind:project />
  {:else}
    <div class="w-full flex justify-center">
      <h1
        class="text-2xl font-bold text-center drop-shadow text-gray-400 dark:text-gray-500"
      >
        Loading project...
      </h1>
    </div>
  {/if}
</section>
