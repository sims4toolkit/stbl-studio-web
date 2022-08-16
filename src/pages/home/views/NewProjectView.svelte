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
  minimumContentHeight="100"
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
        />
        <div class="flex gap-4">
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
          <LocaleSelect bind:selected={primaryLocale} />
        </div>
      </div>
    </MultipageContent>
    <MultipageContent pageNumber={2} bind:state={multipageState}>
      <p>second</p>
    </MultipageContent>
  </div>
</MultipageContentGroup>
