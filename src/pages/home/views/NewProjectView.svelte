<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  import Settings from "src/lib/services/settings";
  const { fnv64 } = window.S4TK.hashing;
  const { formatResourceInstance } = window.S4TK.formatting;

  export let onComplete: () => void;

  const uuid = uuidv4();
  let projectName = "";
  let groupHexString = "80000000";
  let instanceHexString = formatResourceInstance(fnv64(uuid, false));
  let primaryLocale = Settings.defaultLocale;

  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: false,
  };

  $: {
    if (multipageState.currentPage === 1) {
      multipageState.nextButtonEnabled = Boolean(projectName);
    }
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
  onLastPageComplete={onComplete}
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
          <LocaleSelect bind:selected={primaryLocale} fillWidth={true} />
        </div>
        <div>
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
      <p>second</p>
    </MultipageContent>
  </div>
</MultipageContentGroup>
