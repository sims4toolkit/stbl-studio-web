<script lang="ts">
  import { saveAs } from "file-saver";
  import Settings from "src/lib/services/settings";
  import type Project from "src/lib/models/project";
  import { getDisplayName } from "src/lib/utilities/localization";
  import { generateBlobForProjects } from "src/lib/utilities/downloading";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import Select from "src/components/elements/Select.svelte";
  import constants from "src/data/constants.json";
  const { enums } = window.S4TK;

  export let title: string;
  export let detail: string = null;
  export let onComplete: () => void;
  export let project: Project = null;
  export let projects: Project[] = null;

  let namingConventionDisabled = false;
  const projectsToDownload = projects ?? [project];

  $: {
    namingConventionDisabled = Settings.downloadFileType === "package";
    if (namingConventionDisabled) Settings.downloadNamingConvention = "project";
  }

  const fileTypeOptions = [
    {
      value: "package",
      text: "Package",
    },
    {
      value: "stbl",
      text: "String Table",
    },
    {
      value: "json",
      text: "JSON",
    },
  ];

  const localeOptions = [
    {
      value: constants.specialValues.allLocales,
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
      value: "s4s",
      text: "S4S",
    },
    {
      value: "s4pi",
      text: "S4PI",
    },
    {
      value: "project",
      text: "Project Name",
    },
  ];

  let multipageState: MultipageContentState = {
    currentPage: 1,
    nextButtonEnabled: true,
  };

  async function downloadStbls() {
    generateBlobForProjects(
      projectsToDownload,
      Settings.downloadLocales === constants.specialValues.allLocales
        ? enums.StringTableLocale.all()
        : [Settings.downloadLocales],
      Settings.downloadFileType,
      Settings.downloadNamingConvention
    )
      .then(({ filename, data }) => {
        saveAs(data, filename);
        onComplete();
      })
      .catch((err) => {
        alert(
          "Something went wrong and your file(s) could not be downloaded. Please report this."
        );
        console.error(err);
        onComplete();
      });
  }
</script>

<MultipageContentGroup
  numPages={1}
  bind:state={multipageState}
  onLastPageComplete={downloadStbls}
  {title}
  completeButton="Download"
>
  <div slot="content" class="w-full py-2">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div class="flex flex-col gap-6">
        {#if detail}
          <p>{detail}</p>
        {/if}
        <div class="w-full flex flex-wrap sm:flex-nowrap gap-4">
          <Select
            label="download as"
            name="file-type-select"
            fillWidth={true}
            bind:selected={Settings.downloadFileType}
            options={fileTypeOptions}
          />
          <Select
            label="locales"
            name="locales-select"
            fillWidth={true}
            bind:selected={Settings.downloadLocales}
            options={localeOptions}
          />
          <Select
            label="naming convention"
            name="naming-convention-select"
            disabled={namingConventionDisabled}
            fillWidth={true}
            bind:selected={Settings.downloadNamingConvention}
            options={namingConventionOptions}
          />
        </div>
        <p class="text-subtle text-xs">
          If downloading multiple files, they will be zipped.
        </p>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
