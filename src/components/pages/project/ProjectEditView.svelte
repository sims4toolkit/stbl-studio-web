<script lang="ts">
  import type Project from "../../../typescript/models/project";
  import ProjectMetaDataPages from "../../shared/controls/ProjectMetaDataPages.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  export let project: Project;
  export let onComplete: () => void;

  let currentPage = 1;
  let completePages = 1;

  let isPage1Valid = false;
  let primaryLocale = project.primaryLocale;
  let name = project.name;
  let otherLocaleOptions = [];
  let groupHexString = formatAsHexString(project.group, 8);
  let instanceHexString = formatAsHexString(project.instanceBase, 14);

  function nextButtonClicked() {
    // TODO:

    onComplete();
  }
</script>

<MultipageModalContent
  title="Edit Project"
  subtitle="UUID: {project.uuid}"
  numPages={2}
  minimumContentHeight="230"
  bind:currentPage
  bind:completePages
  finalPageNextButtonText="Create"
  onNextButtonClick={nextButtonClicked}
>
  <div slot="content">
    <ProjectMetaDataPages
      uuid={project.uuid}
      {currentPage}
      bind:isPage1Valid
      bind:primaryLocale
      bind:name
      bind:otherLocaleOptions
      bind:groupHexString
      bind:instanceHexString
    />
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
