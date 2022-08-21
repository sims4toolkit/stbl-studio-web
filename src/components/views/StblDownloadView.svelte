<script lang="ts">
  import type Project from "src/lib/models/project";
  import { getDisplayName } from "src/lib/utilities/localization";
  import Select from "src/components/elements/Select.svelte";
  const { enums } = window.S4TK;

  export let projects: Project[];

  const allLocalesValue = 100;
  let fileType = 0;
  let localeValue = allLocalesValue;
  let namingConvention = 0;

  $: localeDisabled = fileType === 3;
  $: namingConventionDisabled = fileType === 0 || fileType === 3;

  $: {
    if (namingConventionDisabled) namingConvention = 2;
  }

  $: {
    if (localeDisabled) localeValue = allLocalesValue;
  }

  const fileTypeOptions = [
    {
      value: 0,
      text: "Package",
    },
    {
      value: 1,
      text: "String Table",
    },
    {
      value: 2,
      text: "JSON",
    },
    {
      value: 3,
      text: "STBL Studio Project",
    },
  ];

  const localeOptions = [
    {
      value: allLocalesValue,
      text: "All Locales",
    },
    ...enums.StringTableLocale.all().map((locale) => {
      return {
        value: locale,
        text: getDisplayName(locale),
      };
    }),
  ];

  const namingConventionOptions = [
    {
      value: 0,
      text: "S4S",
    },
    {
      value: 1,
      text: "S4PI",
    },
    {
      value: 2,
      text: "Project Name",
    },
  ];
</script>

<div class="flex flex-col gap-6">
  <div class="w-full flex flex-wrap sm:flex-nowrap gap-4">
    <Select
      label="download as"
      name="file-type-select"
      fillWidth={true}
      bind:selected={fileType}
      options={fileTypeOptions}
    />
    <Select
      label="locales"
      name="locales-select"
      disabled={localeDisabled}
      fillWidth={true}
      bind:selected={localeValue}
      options={localeOptions}
    />
    <Select
      label="naming convention"
      name="naming-convention-select"
      disabled={namingConventionDisabled}
      fillWidth={true}
      bind:selected={namingConvention}
      options={namingConventionOptions}
    />
  </div>
  <p class="text-subtle text-xs">
    If downloading multiple files, they will be zipped.
  </p>
</div>
