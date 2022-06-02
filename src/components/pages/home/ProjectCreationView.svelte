<script lang="ts">
  import { onDestroy } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import type Workspace from "../../../typescript/models/workspace";
  import Project from "../../../typescript/models/project";
  import { allLocales } from "../../../typescript/helpers/localization";
  import { activeWorkspace } from "../../../typescript/stores";
  import type { LocaleOption } from "../../../global";
  import { Settings } from "../../../typescript/storage";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import ProjectMetaDataPages from "../../shared/controls/ProjectMetaDataPages.svelte";

  const { StringTableLocale } = window.S4TK.enums;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  export let onComplete: () => void;

  const uuid = uuidv4();
  let currentPage = 1;
  let completePages = 1;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  let isPage1Valid = false;
  let name = "";
  let primaryLocale = Settings.defaultLocale;
  let otherLocaleOptions: LocaleOption[] = null;
  let groupHexString = "80000000";
  let instanceHexString = formatAsHexString(
    StringTableLocale.getInstanceBase(fnv64(uuid)),
    14,
    false
  );

  $: {
    completePages = currentPage + (isPage1Valid ? 0 : -1);
  }

  function nextButtonClicked() {
    if (currentPage === 1) {
      otherLocaleOptions = allLocales
        .filter((data) => data.enumValue !== primaryLocale)
        .map((data) => {
          return {
            data,
            checked: false,
          };
        });

      currentPage++;
    } else {
      createProjectAndClose();
    }
  }

  function createProjectAndClose() {
    workspace.addProject(
      new Project(
        {
          uuid,
          name: name.trim(),
          primaryLocale,
          group: parseInt(groupHexString, 16),
          instanceBase: BigInt("0x" + instanceHexString),
        },
        new Map(),
        otherLocaleOptions
          .filter((option) => option.checked)
          .map((option) => option.data.enumValue)
      )
    );

    onComplete();
  }
</script>

<MultipageModalContent
  title="New Project"
  subtitle="UUID: {uuid}"
  numPages={2}
  minimumContentHeight="230"
  bind:currentPage
  bind:completePages
  finalPageNextButtonText="Create"
  onNextButtonClick={nextButtonClicked}
>
  <div slot="content">
    <ProjectMetaDataPages
      {uuid}
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
