<script lang="ts">
  import { saveAs } from "file-saver";
  import type Project from "src/lib/models/project";
  import { getDisplayName } from "src/lib/utilities/localization";
  import { generateBlobForProjects } from "src/lib/utilities/downloading";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import Select from "src/components/elements/Select.svelte";
  const { enums } = window.S4TK;

  export let title: string;
  export let onComplete: () => void;
  export let project: Project = null;
  export let projects: Project[] = null;

  const projectsToDownload = projects ?? [project];
  const allLocalesValue = 100;

  let fileType: "package" | "stbl" | "json" = "package";
  let localeValue = allLocalesValue;
  let namingConvention: "s4s" | "s4pi" | "project" = "project";

  $: namingConventionDisabled = fileType === "package";

  $: {
    if (namingConventionDisabled) namingConvention = "project";
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
      localeValue === allLocalesValue
        ? enums.StringTableLocale.all()
        : [localeValue],
      fileType,
      namingConvention
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
    </MultipageContent>
  </div>
</MultipageContentGroup>
