<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";

  export let onNewProjectCreated: () => void;

  const uuid = uuidv4();
  let projectName = "";

  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: false,
    nextButtonText: "Next",
  };

  $: {
    if (multipageState.currentPage === 1) {
      multipageState.nextButtonEnabled = Boolean(projectName);
    }
  }
</script>

<MultipageContentGroup
  title="New Project"
  subtitle="UUID: {uuid}"
  numPages={2}
  bind:state={multipageState}
  onLastPageComplete={onNewProjectCreated}
>
  <div slot="content" class="w-full">
    <MultipageContent
      pageNumber={1}
      nextButtonText="Next"
      bind:state={multipageState}
    >
      <div class="w-full">
        <TextInput
          label="project name"
          name="project-name-input"
          placeholder="Project name..."
          fillWidth={true}
          bind:value={projectName}
          focusOnMount={true}
        />
      </div>
    </MultipageContent>
    <MultipageContent
      pageNumber={2}
      nextButtonText="Create"
      bind:state={multipageState}
    >
      <p>second</p>
    </MultipageContent>
  </div>
</MultipageContentGroup>
