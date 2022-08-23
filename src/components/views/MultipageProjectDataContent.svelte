<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import type Workspace from "src/lib/models/workspace";
  import Settings from "src/lib/services/settings";
  import { getDisplayName } from "src/lib/utilities/localization";
  import { validateHexString } from "src/lib/utilities/tgi";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import LocaleSelect from "src/components/controls/LocaleSelect.svelte";
  import Checkbox from "src/components/elements/Checkbox.svelte";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import { formatAsHexString } from "@s4tk/hashing/formatting";
  const { enums } = window.S4TK;

  export let startingPageNumber = 1;
  export let multipageState: MultipageContentState;
  export let firstPageValid: boolean;
  export let tgiChoicesDetail: string = null;
  export let localeChoicesDetail: string = null;

  export let uuid: string;
  export let projectName: string;
  export let groupHexString: string;
  export let instanceHexString: string;
  export let primaryLocale: StringTableLocale;
  export let checkedLocales = new Set<StringTableLocale>();
  export let localeChoices: {
    checked: boolean;
    displayName: string;
    locale: StringTableLocale;
  }[];

  let nameValid = false;
  let groupValid = false;
  let instanceValid = false;

  let workspace: Workspace;

  const subscriptions = [
    activeWorkspaceStore.subscribe((wk) => {
      workspace = wk;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: {
    firstPageValid = nameValid && groupValid && instanceValid;
  }

  $: {
    primaryLocale;
    refreshLocaleOptions();
  }

  function toggleOtherLocales(checked: boolean) {
    localeChoices.forEach((choice) => {
      choice.checked = checked;
    });

    localeChoices = localeChoices;
  }

  function refreshLocaleOptions() {
    localeChoices = enums.StringTableLocale.all().map((locale) => ({
      checked: checkedLocales.has(locale) || locale === primaryLocale,
      displayName: getDisplayName(locale),
      locale,
    }));
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
        {
          test: (value) =>
            !workspace.projects.some((project) => {
              return project.uuid !== uuid && project.metaData.name === value;
            }),
          message: "Names must be unique",
        },
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
        monospace={true}
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
        monospace={true}
        validators={[
          {
            test: (value) => validateHexString(value, 14),
            message: "Must be 14-digit hex",
          },
          {
            test: (value) =>
              BigInt(value.startsWith("0x") ? value : `0x${value}`) !== 0n,
            message: "Must be non-zero",
          },
          {
            test: (value) =>
              !workspace.projects.some((project) => {
                return (
                  project.uuid !== uuid &&
                  formatAsHexString(project.metaData.instance, 14, false) ===
                    value.replace("0x", "").toUpperCase()
                );
              }),
            message: "Instances must be unique",
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
      {#if Boolean(tgiChoicesDetail)}
        <p class="text-subtle text-xs mb-2">{tgiChoicesDetail}</p>
      {/if}
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
  <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }} class="w-full">
    {#if Boolean(localeChoicesDetail)}
      <p class="mb-6">{localeChoicesDetail}</p>
    {/if}
    <div>
      <div class="flex gap-4 mb-3">
        <button
          class="uppercase text-sm text-subtle hover:text-black dark:hover:text-white"
          on:click={() => toggleOtherLocales(true)}>select all</button
        >
        <button
          class="uppercase text-sm text-subtle hover:text-black dark:hover:text-white"
          on:click={() => toggleOtherLocales(false)}>deselect all</button
        >
      </div>
      <div class="flex flex-wrap gap-3 text-sm">
        {#each localeChoices as choice, key (key)}
          {#if choice.locale !== primaryLocale}
            <Checkbox label={choice.displayName} bind:checkable={choice} />
          {/if}
        {/each}
      </div>
    </div>
  </div>
</MultipageContent>
