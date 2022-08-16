<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";

  export let onNewProjectCreated: () => void;

  const uuid = uuidv4();

  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: false,
    nextButtonText: "Next",
  };
</script>

<MultipageContentGroup
  title="New Project"
  subtitle="UUID: {uuid}"
  numPages={3}
  bind:state={multipageState}
  onLastPageComplete={onNewProjectCreated}
>
  <MultipageContent
    pageNumber={1}
    nextButtonText="Next"
    bind:state={multipageState}
  >
    <p>first</p>
  </MultipageContent>
  <MultipageContent
    pageNumber={2}
    nextButtonText="Next"
    bind:state={multipageState}
  >
    <p>second</p>
  </MultipageContent>
  <MultipageContent
    pageNumber={3}
    nextButtonText="Create"
    bind:state={multipageState}
  >
    <p>third</p>
  </MultipageContent>
</MultipageContentGroup>
