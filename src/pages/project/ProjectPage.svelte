<script lang="ts">
  import { onDestroy } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "src/lib/models/project";
  import Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import Settings from "src/lib/services/settings";
  import ProjectMetaDataView from "src/components/views/ProjectMetaDataView.svelte";
  const { formatAsHexString } = window.S4TK.formatting;

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
      class="pt-10 px-4 w-full flex justify-center bg-gray-200 dark:bg-gray-900 bottom-shadow"
    >
      <div
        class="w-full xl:max-w-screen-xl py-6 flex justify-between flex-wrap lg:flex-nowrap gap-8"
      >
        <div class="overflow-hidden">
          <h2
            class="font-bold text-xl text-gradient drop-shadow whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {project.metaData.name}
          </h2>
          <p class="text-sm mt-2 text-subtle monospace">
            {formatAsHexString(project.metaData.instance, 14, false)}
          </p>
        </div>
        <div class="flex-1 sm:max-w-sm">
          <ProjectMetaDataView {project} />
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center px-4 py-12">
      <div class="w-full xl:max-w-screen-xl">
        <p>{project}</p>
      </div>
    </div>
  {/if}
</section>
