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
  minimumContentHeight="150"
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
      <div>
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
      <div in:fade>
        <p>Second page.</p>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
