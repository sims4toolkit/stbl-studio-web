<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import GroupInstanceLocale from "../../shared/controls/GroupInstanceLocale.svelte";
  import ProjectMetaDataPages from "../../shared/controls/ProjectMetaDataPages.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  export let selectedProjects: Project[];
  export let onComplete: () => void;

  let completePages = 1;

  let groupHexString = formatAsHexString(selectedProjects[0].group, 8);
  let isGroupValid = true;
  let instanceHexString = formatAsHexString(
    selectedProjects[0].instanceBase,
    14
  );
  let isInstanceValid = true;
  let selectedLocale = selectedProjects[0].primaryLocale;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  function mergeSelectedProjects() {
    if (completePages === 1) {
      completePages++;
    } else {
      onComplete();
    }
  }
</script>

<MultipageModalContent
  title="Confirm Merge"
  numPages={2}
  {completePages}
  currentPage={completePages}
  finalPageNextButtonText="Merge Projects"
  onNextButtonClick={mergeSelectedProjects}
>
  <div slot="content">
    {#if completePages === 1}
      <p class="mt-2">Are you sure you want to merge the following projects?</p>
      <ul class="mb-2 merge-summary">
        {#each selectedProjects as project, key (key)}
          <li>{project.name} ({project.numStrings} strings)</li>
        {/each}
      </ul>
      <p class="subtle-text my-2">
        This cannot be undone. If you want to unmerge your projects, you'll have
        to do it manually.
      </p>
    {:else if completePages === 2}
      <GroupInstanceLocale
        {groupHexString}
        {isGroupValid}
        {instanceHexString}
        {isInstanceValid}
        {selectedLocale}
      />
      <!-- <ProjectMetaDataPages
        {uuid}
        {currentPage}
        bind:isPage1Valid
        bind:primaryLocale
        bind:name
        bind:otherLocaleOptions
        bind:groupHexString
        bind:instanceHexString
      /> -->
    {/if}
  </div>
</MultipageModalContent>

<style lang="scss">
  ul.merge-summary {
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
