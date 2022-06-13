<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import GroupInstanceLocale from "../../shared/controls/GroupInstanceLocale.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  export let selectedProjects: Project[];
  export let onComplete: () => void;

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
    // workspace.deleteProjects(...selectedProjects);
    onComplete();
  }
</script>

<MultipageModalContent
  title="Confirm Merge"
  numPages={1}
  completePages={1}
  currentPage={1}
  finalPageNextButtonText="Merge Projects"
  onNextButtonClick={mergeSelectedProjects}
>
  <div slot="content">
    <p class="mt-2">Are you sure you want to merge the following projects?</p>
    <ul class="mb-2 merge-summary">
      {#each selectedProjects as project, key (key)}
        <li>{project.name} ({project.numStrings} strings)</li>
      {/each}
    </ul>
    <GroupInstanceLocale
      {groupHexString}
      {isGroupValid}
      {instanceHexString}
      {isInstanceValid}
      {selectedLocale}
    />
    <p class="subtle-text my-2">
      This cannot be undone. If you want to unmerge your projects, you'll have
      to do it manually.
    </p>
  </div>
</MultipageModalContent>

<style lang="scss">
  ul.merge-summary {
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
