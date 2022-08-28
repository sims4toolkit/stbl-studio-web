<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { parse, v4 as uuidv4 } from "uuid";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import {
    ParsedFilesResult,
    resolveStringTables,
  } from "src/lib/utilities/uploading";
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
  import Switch from "src/components/elements/Switch.svelte";
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

  let parseResult: ParsedFilesResult = null;
  let chosenInstanceOption = 0;
  let useUuidForInst = false;
  let instanceOptions: {
    value: number;
    text: string;
  }[];

  $: {
    if (parseResult) handleParseResult();
  }

  const subscriptions = [
    activeWorkspaceStore.subscribe((workspace) => {
      if (workspace) activeWorkspace = workspace;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  async function createProject() {
    const stbl = await resolveStringTables(primaryLocale, parseResult.stbls);

    const project = new Project(
      uuid,
      {
        name: projectName,
        group: parseInt(groupHexString, 16),
        instance: BigInt(
          instanceHexString.startsWith("0x")
            ? instanceHexString
            : `0x${instanceHexString}`
        ),
        numEntries: stbl.numEntries,
        numLocales: stbl.numLocales,
        primaryLocale,
      },
      stbl
    );

    activeWorkspace.addProject(project);

    onComplete();
  }

  function handleParseResult() {
    const instances = [...parseResult.instances];

    instanceOptions = instances.map((inst, i) => {
      return {
        value: i,
        text: formatAsHexString(inst, 14, false),
      };
    });

    if (parseResult.locales.has(Settings.defaultLocale)) {
      primaryLocale = Settings.defaultLocale;
    } else {
      const [locale] = parseResult.locales;
      primaryLocale = locale;
    }
  }

  function onNextButtonClick(page: number) {
    if (page === 3) {
      multipageState.nextButtonEnabled = false;

      if (!useUuidForInst) {
        instanceHexString = formatAsHexString(
          [...parseResult.instances][chosenInstanceOption],
          14,
          false
        );
      }
    }
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
  onPageComplete={onNextButtonClick}
>
  <div slot="content" class="w-full">
    <MultipageStblUploadContent
      startingPageNumber={1}
      bind:multipageState
      bind:parseResult
    />
    <MultipageContent pageNumber={3} bind:state={multipageState}>
      <div
        class="flex flex-col gap-6"
        in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
      >
        {#if instanceOptions.length > 1}
          <p>
            There are {instanceOptions.length} instance bases in the uploaded STBLs.
            Which should this project use?
          </p>
        {:else}
          <p>There is 1 instance base in the uploaded STBL(s).</p>
        {/if}
        <Select
          name="instance-select"
          label="existing instances"
          disabled={useUuidForInst}
          fillWidth={true}
          bind:selected={chosenInstanceOption}
          options={instanceOptions}
        />
        <Switch
          label="Alternatively, you can hash this project's UUID:"
          bind:checked={useUuidForInst}
        />
        <p class="text-subtle text-xs">
          ...or, you can set it manually on the next page.
        </p>
      </div>
    </MultipageContent>
    <MultipageProjectDataContent
      {uuid}
      startingPageNumber={4}
      bind:multipageState
      bind:firstPageValid={multipageState.nextButtonEnabled}
      bind:projectName
      bind:groupHexString
      bind:instanceHexString
      bind:primaryLocale
      bind:localeChoices
      checkedLocales={parseResult?.locales}
      tgiChoicesDetail="The instance is the hash of the UUID by default, but it can be changed
      manually."
      localeChoicesDetail="Select any locales you want to track translations for. You can still download locales that are not included, but they will contain the same text as your primary locale."
    />
  </div>
</MultipageContentGroup>
