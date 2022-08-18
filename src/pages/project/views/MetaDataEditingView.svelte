<script lang="ts">
  import type Project from "src/lib/models/project";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageProjectDataContent from "src/components/views/MultipageProjectDataContent.svelte";
  const { formatAsHexString } = window.S4TK.formatting;

  export let project: Project;
  export let onComplete: () => void;

  let projectName = project.metaData.name;
  let groupHexString = formatAsHexString(project.metaData.group, 8, false);
  let instanceHexString = formatAsHexString(
    project.metaData.instance,
    14,
    false
  );
  let primaryLocale = project.metaData.primaryLocale;
  let otherLocales = new Set(project.stbl.allLocales);
  otherLocales.delete(primaryLocale);

  let multipageState = {
    currentPage: 1,
    nextButtonEnabled: true,
  };

  async function saveEdits() {
    project.stbl.replaceLocales([...otherLocales]);
    project.metaData.numLocales = project.stbl.numLocales;
    project.metaData.numEntries = project.stbl.numEntries;
    await project.stbl.saveToStorage(project.uuid);

    project.metaData.name = projectName;
    project.metaData.group = parseInt(groupHexString, 16);
    project.metaData.instance = BigInt("0x" + instanceHexString);
    project.metaData.primaryLocale = primaryLocale;
    await project.saveToStorage();

    project = project;
    // FIXME: how to refresh properly?

    onComplete();
  }
</script>

<MultipageContentGroup
  numPages={2}
  title="Edit Project"
  subtitle="UUID: {project.uuid}"
  minimumContentHeight="220"
  centerVertically={true}
  completeButton="Save Edits"
  bind:state={multipageState}
  onLastPageComplete={saveEdits}
>
  <div slot="content" class="w-full">
    <MultipageProjectDataContent
      bind:multipageState
      bind:projectName
      bind:groupHexString
      bind:instanceHexString
      bind:primaryLocale
      bind:otherLocales
    />
  </div>
</MultipageContentGroup>
