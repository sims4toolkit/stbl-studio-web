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
  minimumContentHeight="220"
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Create"
  onLastPageComplete={createProject}
>
  <div slot="content" class="w-full">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div class="flex flex-col gap-6">
        <p>
          Upload the string table(s) you'd like to include in this project. They
          can be binary, JSON, or in packages. Feel free to upload all of the
          packages for your mod, unneeded files will be ignored.
        </p>
        <FileInput
          accept=".package,.stbl,.binary,.json"
          label="upload files"
          multiple={true}
          errorMessage="Test"
        />
        <div>
          <p class="text-sm text-subtle mb-2">
            If there are multiple tables for the same language, they will be
            merged. The best way to ensure that multiple languages are handled
            properly is by uploading them in packages.
          </p>
          <p class="text-sm text-subtle">
            Using JSON? Read about the expected structure <span
              class="underline text-accent-secondary-light dark:text-accent-secondary-dark"
              >here</span
            >.
          </p>
        </div>
      </div>
    </MultipageContent>
    <MultipageContent pageNumber={2} bind:state={multipageState}>
      <p>Second</p>
    </MultipageContent>
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
