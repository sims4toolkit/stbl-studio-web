<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import Settings from "src/lib/services/settings";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import type { MultipageContentState } from "src/components/layouts/types";
  import FileInput from "src/components/elements/FileInput.svelte";
  import Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";

  export let onOnboardingComplete: () => void;

  const animationDuration = Settings.reduceMotion ? 0 : 850;

  let uploadedFiles: FileList;
  let uploadError = "";
  let isUploadingWorkspace = false;
  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: true,
  };

  $: {
    if (uploadedFiles?.length) restoreWorkspace();
  }

  async function createNewWorkspace() {
    activeWorkspaceStore.set(new Workspace());
    onOnboardingComplete();
  }

  async function restoreWorkspace() {
    try {
      const [file] = uploadedFiles;
      const buffer = window.S4TK.Node.Buffer.from(await file.arrayBuffer());
      const json = JSON.parse(buffer.toString());
      const wk = await Workspace.restoreFromJson(json);
      activeWorkspaceStore.set(wk);
      onOnboardingComplete();
    } catch (err) {
      console.error(err);
      uploadError = "Not a valid workspace";
    }
  }

  function handleWorkspaceButtonClick(event: MouseEvent) {
    isUploadingWorkspace = !isUploadingWorkspace;
    (event.target as HTMLButtonElement).blur();
  }
</script>

{#if isUploadingWorkspace}
  <div class="w-full">
    <div in:fly={{ y: -15, duration: animationDuration }}>
      <div class="max-w-min">
        <h2
          class="font-bold whitespace-nowrap text-2xl mb-2 text-gradient drop-shadow"
        >
          Welcome Back
        </h2>
      </div>
      <p class="mt-8">
        Upload your workspace JSON file to pick up where you left off.
      </p>
    </div>
    <div class="mt-8" in:fly={{ y: 20, duration: animationDuration }}>
      <FileInput
        accept=".json"
        label="workspace json only"
        bind:files={uploadedFiles}
        bind:errorMessage={uploadError}
      />
    </div>
  </div>
{:else}
  <MultipageContentGroup
    numPages={2}
    bind:state={multipageState}
    minimumContentHeight="180"
    centerVertically={true}
    onLastPageComplete={createNewWorkspace}
    completeButton="Get Started"
  >
    <div slot="header">
      <p>Welcome to</p>
      <h2 class="font-bold text-2xl mb-2 text-gradient drop-shadow">
        String Table Studio
      </h2>
      <p class="text-sm text-subtle">
        Powered by <a
          class="text-secondary"
          href="https://sims4toolkit.com"
          target="_blank">Sims 4 Toolkit</a
        >
      </p>
    </div>
    <div slot="content" class="flex flex-col gap-4">
      <MultipageContent pageNumber={1} bind:state={multipageState}>
        <div class="flex flex-col gap-4">
          <p>
            String Table Studio is a web app that makes it easy to create, edit,
            and translate string tables for Sims 4 mods. View the <a
              class="text-secondary"
              href="https://frankkmods.com"
              target="_blank">feature list</a
            > to learn more about what it can do.
          </p>
          <!-- TODO: update links -->
          <p>
            Not sure where to start? Read <a
              class="text-secondary"
              href="https://frankkmods.com"
              target="_blank">this guide</a
            > to learn how to migrate your string tables to a STBL Studio project.
          </p>
          <!-- TODO: note for translators and people just using web tools -->
        </div>
      </MultipageContent>
      <MultipageContent pageNumber={2} bind:state={multipageState}>
        <div class="flex flex-col gap-4" in:fade>
          <p>Before proceeding, please keep in mind:</p>
          <ul class="list-disc pl-8 flex flex-col gap-2">
            <li class="pl-2">
              All data that you create or upload on this website is stored
              locally on your computer, not on the internet. If you clear your
              browser's storage, you will lose your data.
            </li>
            <li class="pl-2">
              You can download your data at any time, and use it to backup,
              restore, or move your entire workspace to another browser or
              device.
            </li>
            <li class="pl-2">
              Your data is your responsibility. I am not at fault for any
              losses.
            </li>
          </ul>
        </div>
      </MultipageContent>
    </div>
  </MultipageContentGroup>
{/if}

<div class="w-full flex justify-center">
  <button
    class="flex gap-2 items-center fixed bottom-10 rounded py-2 px-4 text-sm border border-black dark:border-white hover:text-white hover:dark:text-black"
    on:click={handleWorkspaceButtonClick}
    ><img
      src="./assets/{isUploadingWorkspace ? 'x' : 'upload'}.svg"
      class="svg h-4"
      alt="Upload"
    />
    {#if isUploadingWorkspace}
      Stop Uploading
    {:else}
      Upload Workspace
    {/if}
  </button>
</div>

<style lang="scss">
  button {
    &:hover {
      background-color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);

      img {
        filter: var(--filter-svg-invert);
      }
    }
  }
</style>
