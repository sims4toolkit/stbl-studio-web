<script lang="ts">
  import saveAs from "file-saver";
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
  import SectionHeader from "src/components/elements/SectionHeader.svelte";

  export let params: { uuid: string };

  let activeWorkspace: Workspace;
  let project: Project;
  let projectLoaded = false;
  let projectErrorMessage: string = undefined;
  let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;

  $: {
    if (project?.hasStbl) refreshSelectionGroup();
  }

  function refreshSelectionGroup() {
    // FIXME: might be an issue with importing strings
    if (project.stbl.numEntries !== selectionGroup?.selectables.length) {
      selectionGroup = new SelectionGroup<LocalizedStringEntry, number>(
        project.stbl.entries,
        "id",
        () => {
          selectionGroup = selectionGroup;
        }
      );
    }
  }

  function copyErrorToClipboard() {
    navigator.clipboard.writeText(projectErrorMessage);
  }

  function downloadWorkspace() {
    activeWorkspace.toJson().then((json) => {
      const blob = new Blob([JSON.stringify(json)]);
      saveAs(blob, "StblStudioWorkspace.json");
    });
  }

  const subscriptions = [
    activeWorkspaceStore.subscribe(async (workspace) => {
      if (workspace) {
        activeWorkspace = workspace;
        project = workspace.projects.find((p) => p.uuid === params.uuid);
        if (!project) {
          replace("/");
        } else {
          try {
            await project.loadStringTable();
          } catch (err) {
            console.error(err);
            projectErrorMessage = err.stack ?? err.toString();
            return;
          }

          refreshSelectionGroup();
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

<svelte:head>
  <title>STBL Studio | {project?.metaData.name ?? "Loading..."}</title>
</svelte:head>

<section
  class="w-full flex flex-col justify-center overflow-x-hidden"
  class:flex-1={!projectLoaded}
>
  {#if projectLoaded}
    <ProjectPageHeader bind:project />
    <div class="w-full flex justify-center px-4 py-8">
      <div class="w-full xl:max-w-screen-xl">
        <ViewSwitcher bind:project bind:selectionGroup />
      </div>
    </div>
    <ProjectActionButtons bind:selectionGroup bind:project />
  {:else if Boolean(projectErrorMessage)}
    <div class="pt-10 flex-1 w-full flex justify-center">
      <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
        <div class="mb-4">
          <SectionHeader title="Well, this sucks" />
        </div>
        <p class="mb-4">
          It appears that this project has been corrupted. Please <a
            class="text-secondary"
            href="https://frankkmods.com/#/about"
            target="_blank">report this problem to me ASAP</a
          >.
        </p>
        <p class="mb-2">
          I may be able to recover your project and prevent this issue from
          occurring again. To help me help you, please send me:
        </p>
        <ul class="list-disc pl-6">
          <li>
            The error message (<button
              class="text-secondary underline hover:no-underline"
              on:click={copyErrorToClipboard}>click to copy</button
            >)
          </li>
          <li>
            Your workspace JSON (<button
              class="text-secondary underline hover:no-underline"
              on:click={downloadWorkspace}>click to download</button
            >)
          </li>
          <li>What you did before you saw this error</li>
        </ul>
        <p class="mt-4">
          Note that your workspace JSON is most likely in an invalid state. If
          so, it will remain broken until you delete this project.
        </p>
        <p class="mt-8 text-subtle text-xs">Please don't hate me</p>
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
