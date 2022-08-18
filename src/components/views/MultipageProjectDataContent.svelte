<script lang="ts">
  import { fade } from "svelte/transition";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  import { validateHexString } from "src/lib/utilities/tgi";

  export let startingPageNumber = 1;
  export let multipageState: MultipageContentState;
  export let firstPageValid: boolean;
  export let projectName: string;
  export let groupHexString: string;
  export let instanceHexString: string;
  export let primaryLocale: StringTableLocale;
  export let otherLocales: Set<StringTableLocale>;

  let nameValid = false;
  let groupValid = false;
  let instanceValid = false;

  $: {
    firstPageValid = nameValid && groupValid && instanceValid;
  }
</script>

<MultipageContent pageNumber={startingPageNumber} bind:state={multipageState}>
  <div class="w-full flex flex-col gap-4">
    <TextInput
      label="project name"
      name="project-name-input"
      placeholder="Project name..."
      fillWidth={true}
      bind:value={projectName}
      bind:isValid={nameValid}
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
        bind:isValid={groupValid}
        validators={[
          {
            test: (value) => validateHexString(value, 8),
            message: "Must be 8-digit hex",
          },
        ]}
      />
      <TextInput
        label="instance"
        name="project-instance-input"
        placeholder="Instance"
        fillWidth={true}
        bind:value={instanceHexString}
        bind:isValid={instanceValid}
        validators={[
          {
            test: (value) => validateHexString(value, 14),
            message: "Must be 14-digit hex",
          },
        ]}
      />
      <LocaleSelect
        label="primary locale"
        bind:selected={primaryLocale}
        fillWidth={true}
      />
    </div>
    <div class="mt-2">
      <p class="text-subtle text-xs mb-2">
        The instance is the hash of the UUID by default, but it can be changed
        manually.
      </p>
      <p class="text-subtle text-xs">
        The 2-digit locale code will automatically be prepended to the instance.
      </p>
    </div>
  </div>
</MultipageContent>
<MultipageContent
  pageNumber={startingPageNumber + 1}
  bind:state={multipageState}
>
  <div in:fade>
    <!-- FIXME: actually let user choose -->
    <p>{otherLocales}</p>
  </div>
</MultipageContent>
