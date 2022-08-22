<script lang="ts">
  import { onDestroy } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import { getDisplayName } from "src/lib/utilities/localization";
  import Settings from "src/lib/services/settings";
  import Project from "src/lib/models/project";
  import LocalizedStringTable from "src/lib/models/localized-stbl";
  import type Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import MultipageProjectDataContent from "src/components/views/MultipageProjectDataContent.svelte";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import FileInput from "src/components/elements/FileInput.svelte";
  import MultipageStblUploadContent from "src/components/views/MultipageStblUploadContent.svelte";
  const { enums } = window.S4TK;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  export let onComplete: () => void;

  const uuid = uuidv4();
  let projectName = "";
  let groupHexString = "80000000";
  let instanceHexString = formatAsHexString(
    enums.StringTableLocale.getInstanceBase(fnv64(uuid, false)),
    14,
    false
  );
  let primaryLocale = Settings.defaultLocale;
  let localeChoices: {
    checked: boolean;
    displayName: string;
    locale: StringTableLocale;
  }[];

  let activeWorkspace: Workspace;
  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: false,
  };

  let validFilesUploaded = false;

  $: {
    if (multipageState.currentPage === 1 && validFilesUploaded) {
      multipageState.nextButtonEnabled = true;
    }
  }

  $: {
    primaryLocale;
    refreshLocaleOptions();
  }

  const subscriptions = [
    activeWorkspaceStore.subscribe((workspace) => {
      if (workspace) activeWorkspace = workspace;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function createProject() {
    // TODO:

    onComplete();
  }

  function refreshLocaleOptions() {
    localeChoices = enums.StringTableLocale.all().map((locale) => ({
      checked: locale === primaryLocale,
      displayName: getDisplayName(locale),
      locale,
    }));
  }
</script>

<MultipageContentGroup
  title="Upload Project"
  subtitle="UUID: {uuid}"
  numPages={4}
  minimumContentHeight="230"
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Create"
  onLastPageComplete={createProject}
>
  <div slot="content" class="w-full">
    <MultipageStblUploadContent
      startingPageNumber={1}
      bind:multipageState
      bind:firstPageValid={validFilesUploaded}
    />
    <MultipageProjectDataContent
      startingPageNumber={3}
      bind:multipageState
      bind:firstPageValid={multipageState.nextButtonEnabled}
      bind:projectName
      bind:groupHexString
      bind:instanceHexString
      bind:primaryLocale
      bind:localeChoices
      tgiChoicesDetail="The instance is the hash of the UUID by default, but it can be changed
      manually."
      localeChoicesDetail="Select any locales you want to track translations for. You can still download locales that are not included, but they will contain the same text as your primary locale."
    />
  </div>
</MultipageContentGroup>
