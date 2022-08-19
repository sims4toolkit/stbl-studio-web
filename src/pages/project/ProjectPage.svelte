<script lang="ts">
  import { onDestroy } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "src/lib/models/project";
  import Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import Settings from "src/lib/services/settings";
  import ProjectPageHeader from "./views/ProjectPageHeader.svelte";
  import StringListView from "./views/StringListView.svelte";

  export let params: { uuid: string };

  let project: Project;
  let projectLoaded = false;

  const subscriptions = [
    activeWorkspaceStore.subscribe(async (workspace) => {
      if (workspace) {
        project = workspace.projects.find((p) => p.uuid === params.uuid);
        if (!project) {
          replace("/");
        } else {
          await project.loadStringTable();
          // project.stbl.addEntry(0x12345678, "hello"); // FIXME:
          // project.stbl.addEntry(0x87654321, "goodbye"); // FIXME:
          // project.stbl.addEntry(0x12345678, "hello"); // FIXME:
          // project.stbl.addEntry(0x87654321, "goodbye"); // FIXME:
          // project.stbl.addEntry(0x12345678, "hello"); // FIXME:
          // project.stbl.addEntry(0x87654321, "goodbye"); // FIXME:
          // project.stbl.addEntry(0x12345678, "hello"); // FIXME:
          // project.stbl.addEntry(0x87654321, "goodbye"); // FIXME:
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
  class="w-full flex flex-col justify-center"
  class:flex-1={!projectLoaded}
>
  {#if projectLoaded}
    <ProjectPageHeader {project} />
    <div class="w-full flex justify-center px-4 py-12">
      <div class="w-full xl:max-w-screen-xl">
        <StringListView bind:project />
      </div>
    </div>
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
