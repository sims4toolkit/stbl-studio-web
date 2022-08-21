<script lang="ts">
  import type Project from "src/lib/models/project";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import StblDownloadView from "src/components/views/StblDownloadView.svelte";

  export let onComplete: () => void;
  export let project: Project;

  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: true,
  };

  function downloadStbls() {
    // TODO:
    onComplete();
  }
</script>

<MultipageContentGroup
  numPages={1}
  bind:state={multipageState}
  onLastPageComplete={downloadStbls}
  title="Download Project"
  completeButton="Download"
>
  <div slot="content">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <StblDownloadView projects={[project]} />
    </MultipageContent>
  </div>
</MultipageContentGroup>
