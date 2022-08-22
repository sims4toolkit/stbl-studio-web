<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import type { ParsedFilesResult } from "src/lib/utilities/uploading";
  import Settings from "src/lib/services/settings";
  import Project from "src/lib/models/project";
  import LocalizedStringTable from "src/lib/models/localized-stbl";
  import type Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import MultipageProjectDataContent from "src/components/views/MultipageProjectDataContent.svelte";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageStblUploadContent from "src/components/views/MultipageStblUploadContent.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import Select from "src/components/elements/Select.svelte";
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

  let parseResult: ParsedFilesResult;
  let chosenInstanceOption = 0;
  $: instanceOptions = parseResult?.instances.map((inst, i) => {
    return {
      value: i,
      text: formatAsHexString(inst, 14, false),
    };
  });

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
</script>

<MultipageContentGroup
  title="Upload Project"
  subtitle="UUID: {uuid}"
  numPages={5}
  minimumContentHeight="230"
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Create"
  canClickBack={false}
  onLastPageComplete={createProject}
>
  <div slot="content" class="w-full">
    <MultipageStblUploadContent
      startingPageNumber={1}
      bind:multipageState
      bind:parseResult
    />
    <MultipageContent pageNumber={3} bind:state={multipageState}>
      <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}>
        <Select
          name="instance-select"
          label="existing instances"
          bind:selected={chosenInstanceOption}
          options={instanceOptions}
        />
      </div>
    </MultipageContent>
    <MultipageProjectDataContent
      startingPageNumber={4}
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
