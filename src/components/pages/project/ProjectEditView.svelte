<script lang="ts">
  import { onDestroy } from "svelte";
  import type { LocaleOption } from "../../../global";
  import { allLocales } from "../../../typescript/helpers/localization";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import ProjectMetaDataPages from "../../shared/controls/ProjectMetaDataPages.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  export let project: Project;
  export let onComplete: () => void;

  let currentPage = 1;
  let isPage1Valid = false;
  let primaryLocale = project.primaryLocale;
  let name = project.name;
  let otherLocaleOptions: LocaleOption[] = null;
  let groupHexString = formatAsHexString(project.group, 8);
  let instanceHexString = formatAsHexString(project.instanceBase, 14);

  const keySubscriptions = [subscribeToKey("Escape", onComplete)];

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  $: completePages = currentPage + (isPage1Valid ? 0 : -1);

  async function nextButtonClicked() {
    if (currentPage === 1) {
      otherLocaleOptions = allLocales
        .filter((data) => data.enumValue !== primaryLocale)
        .map((data) => {
          return {
            data,
            checked: project.stblMap.has(data.enumValue),
          };
        });

      currentPage++;
    } else {
      const oldPrimary = project.primaryLocale;
      project.name = name;
      project.group = parseInt(groupHexString, 16);
      project.instanceBase = BigInt("0x" + instanceHexString);
      project.primaryLocale = primaryLocale;
      project.setLocales(
        otherLocaleOptions.filter((o) => o.checked).map((o) => o.data.enumValue)
      );
      project.save();

      if (project.primaryLocale === oldPrimary) {
        project = project;
        onComplete();
      } else {
        location.reload();
      }
    }
  }
</script>

<MultipageModalContent
  title="Edit Project"
  subtitle="UUID: {project.uuid}"
  numPages={2}
  minimumContentHeight="230"
  bind:currentPage
  {completePages}
  finalPageNextButtonText="Save"
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
