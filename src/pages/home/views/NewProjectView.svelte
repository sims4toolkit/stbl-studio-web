<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  import Settings from "src/lib/services/settings";
  import Project from "src/lib/models/project";
  import LocalizedStringTable from "src/lib/models/localized-stbl";
  import type Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import { subscribeToKey } from "src/lib/utilities/keybindings";
  const { fnv64 } = window.S4TK.hashing;
  const { StringTableLocale } = window.S4TK.enums;
  const { formatResourceInstance } = window.S4TK.formatting;

  export let onComplete: () => void;

  const uuid = uuidv4();
  let projectName = "";
  let groupHexString = "80000000";
  let instanceHexString = formatResourceInstance(
    StringTableLocale.getInstanceBase(fnv64(uuid, false))
  );
  let primaryLocale = Settings.defaultLocale;
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

  $: {
    if (multipageState.currentPage === 1) {
      multipageState.nextButtonEnabled = Boolean(projectName);
    }
  }

  function createProject() {
    const stbl = new LocalizedStringTable(
      primaryLocale,
      new Set([
        primaryLocale, // FIXME: add chosen locales instead
      ])
    );

    const project = new Project(
      uuid,
      {
        name: projectName,
        group: parseInt(groupHexString),
        instance: BigInt("0x" + instanceHexString),
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
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div class="w-full flex flex-col gap-4">
        <TextInput
          label="project name"
          name="project-name-input"
          placeholder="Project name..."
          fillWidth={true}
          bind:value={projectName}
          focusOnMount={true}
          validators={[
            {
              test: (value) => value.trim().length > 0,
              message: "Must be non-empty",
            },
            {
              test: (value) => value.trim().length <= 30,
              message: "Cannot exceed 30 characters",
            },
            // TODO: cannot reuse names
            // {
            //   test: (value) => value.trim().length <= 30,
            //   message: "Cannot exceed 30 characters",
            // },
          ]}
        />
        <div class="flex gap-4 flex-wrap sm:flex-nowrap">
          <TextInput
            label="group"
            name="project-group-input"
            placeholder="Group"
            fillWidth={true}
            bind:value={groupHexString}
          />
          <TextInput
            label="instance"
            name="project-instance-input"
            placeholder="Instance"
            fillWidth={true}
            bind:value={instanceHexString}
          />
          <LocaleSelect
            label="primary locale"
            bind:selected={primaryLocale}
            fillWidth={true}
          />
        </div>
        <div class="mt-2">
          <p class="text-subtle text-xs mb-2">
            The instance is the hash of the UUID by default, but it can be
            changed manually.
          </p>
          <p class="text-subtle text-xs">
            The 2-digit locale code will automatically be prepended to the
            instance.
          </p>
        </div>
      </div>
    </MultipageContent>
    <MultipageContent pageNumber={2} bind:state={multipageState}>
      <div in:fade>
        <p>second</p>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
