<script lang="ts">
  import { onDestroy } from "svelte";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import Settings from "src/lib/services/settings";
  import Project from "src/lib/models/project";
  import LocalizedStringTable from "src/lib/models/localized-stbl";
  import type Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import MultipageProjectDataContent from "src/components/views/MultipageProjectDataContent.svelte";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import saltedUuid from "src/lib/utilities/uuid";
  const { enums } = window.S4TK;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  export let onComplete: () => void;

  const uuid = saltedUuid();
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

  const subscriptions = [
    activeWorkspaceStore.subscribe((workspace) => {
      if (workspace) activeWorkspace = workspace;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function createProject() {
    const stbl = new LocalizedStringTable(
      primaryLocale,
      new Set(
        localeChoices
          .filter((choice) => choice.checked)
          .map((choice) => choice.locale)
      )
    );

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
        flags: 0,
        numEntries: stbl.numEntries,
        numLocales: stbl.numLocales,
        primaryLocale,
      },
      stbl
    );

    activeWorkspace.addProject(project);

    onComplete();
  }
</script>

<MultipageContentGroup
  title="New Project"
  subtitle="UUID: {uuid}"
  numPages={2}
  minimumContentHeight="220"
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Create"
  onLastPageComplete={createProject}
>
  <div slot="content" class="w-full">
    <MultipageProjectDataContent
      {uuid}
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
