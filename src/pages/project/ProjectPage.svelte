<script lang="ts">
  import { onDestroy } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "src/lib/models/project";
  import Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import Settings from "src/lib/services/settings";

  export let params: { uuid: string };

  let project: Project;

  const subscriptions = [
    activeWorkspaceStore.subscribe((workspace) => {
      if (workspace) {
        project = workspace.projects.find((p) => p.uuid === params.uuid);
        if (!project) {
          replace("/");
        } else {
          project.loadStringTable();
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
  class="w-full flex flex-col justify-center"
  class:flex-1={project === undefined}
>
  {#if project === undefined}
    <div class="w-full flex justify-center">
      <h1
        class="text-2xl font-bold text-center drop-shadow text-gray-400 dark:text-gray-500"
      >
        Loading project...
      </h1>
    </div>
  {:else}
    <div
      class="pt-10 w-full flex justify-center bg-gray-300 dark:bg-gray-900 bottom-shadow"
    >
      <div class="w-full xl:max-w-screen-xl px-4 py-12">
        <h2 class="gradient-text block">{project.metaData.name}</h2>
      </div>
    </div>
    <div class="w-full flex justify-center px-4 py-12">
      <div class="w-full xl:max-w-screen-xl">
        <p>{project}</p>
      </div>
    </div>
  {/if}
</section>
