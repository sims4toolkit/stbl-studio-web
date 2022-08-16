<script lang="ts">
  import { fade } from "svelte/transition";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import type { MultipageContentState } from "src/components/layouts/types";

  export let onOnboardingComplete: () => void;

  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: true,
    nextButtonText: "Next",
  };
</script>

<MultipageContentGroup
  numPages={2}
  bind:state={multipageState}
  minimumContentHeight="180"
  centerVertically={true}
  onLastPageComplete={onOnboardingComplete}
>
  <div slot="header">
    <p>Welcome to</p>
    <h2 class="font-bold text-2xl mb-2 text-gradient drop-shadow">
      String Table Studio
    </h2>
    <p class="text-sm text-gray-600 dark:text-gray-400">
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
            href="/"
            target="_blank">feature list</a
          > to learn more about what it can do.
        </p>
        <p>TODO</p>
      </div>
    </MultipageContent>
    <MultipageContent pageNumber={2} bind:state={multipageState}>
      <div class="flex flex-col gap-4" in:fade>
        <p>Before proceeding, please keep in mind:</p>
        <ul class="list-disc pl-8 flex flex-col gap-2">
          <li class="pl-2">
            All data that you create or upload on this website is stored locally
            on your computer, not on the internet. If you clear your browser's
            storage, you will lose your data.
          </li>
          <li class="pl-2">
            You can download your data at any time, and use it to backup,
            restore, or move your entire workspace to another browser or device.
          </li>
          <li class="pl-2">
            Your data is your responsibility. I am not at fault for any losses.
          </li>
        </ul>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
