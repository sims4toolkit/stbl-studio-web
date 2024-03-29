<script lang="ts">
  import type Project from "src/lib/models/project";
  import { getDisplayName } from "src/lib/utilities/localization";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageProjectDataContent from "src/components/views/MultipageProjectDataContent.svelte";
  const { formatAsHexString } = window.S4TK.formatting;
  const { enums } = window.S4TK;

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
  let localeChoices = enums.StringTableLocale.all().map((locale) => ({
    checked: project.stbl.hasLocale(locale),
    displayName: getDisplayName(locale),
    locale,
  }));
  let checkedLocales = new Set(
    localeChoices.filter((c) => c.checked).map((c) => c.locale)
  );

  let multipageState = {
    currentPage: 1,
    nextButtonEnabled: true,
  };

  async function saveEdits() {
    const newLocales = localeChoices
      .filter((choice) => choice.checked)
      .map((choice) => choice.locale);

    project.stbl.primaryLocale = primaryLocale;
    project.stbl.replaceLocales(newLocales);
    project.metaData.numLocales = project.stbl.numLocales;
    project.metaData.numEntries = project.stbl.numEntries;
    await project.stbl.saveToStorage(project.uuid);

    project.metaData.name = projectName;
    project.metaData.group = parseInt(groupHexString, 16);
    project.metaData.instance = BigInt(
      instanceHexString.startsWith("0x")
        ? instanceHexString
        : `0x${instanceHexString}`
    );
    project.metaData.primaryLocale = primaryLocale;
    await project.saveToStorage();

    project = project;

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
      uuid={project.uuid}
      bind:multipageState
      bind:firstPageValid={multipageState.nextButtonEnabled}
      bind:projectName
      bind:groupHexString
      bind:instanceHexString
      bind:primaryLocale
      bind:localeChoices
      bind:checkedLocales
      localeChoicesDetail="Add or remove locales from this project. Removing locales will permanently delete any and all translations associated with them."
    />
  </div>
</MultipageContentGroup>
