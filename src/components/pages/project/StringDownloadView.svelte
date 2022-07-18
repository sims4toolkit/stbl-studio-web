<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import { onDestroy } from "svelte";
  import type { FileDownloadInfo } from "../../../global";
  import DownloadMethod from "../../../typescript/enums/download-method";
  import DownloadOption from "../../../typescript/enums/download-options";
  import NamingConvention from "../../../typescript/enums/naming-convention";
  import {
    getDisplayName,
    getLocaleData,
  } from "../../../typescript/helpers/localization";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import { Settings } from "../../../typescript/storage";
  import Downloader from "../../shared/controls/Downloader.svelte";
  import Select from "../../shared/elements/Select.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  export let project: Project;
  export let onComplete: () => void;

  let isDownloading = false;
  let downloadInfo: FileDownloadInfo;

  let selectedDownloadMethod = Settings.downloadMethod;
  const downloadMethods = [
    {
      text: "Package",
      value: DownloadMethod.Package,
    },
    {
      text: "String Table(s)",
      value: DownloadMethod.StringTables,
    },
    {
      text: "JSON(s)",
      value: DownloadMethod.Jsons,
    },
  ];
  $: {
    if (selectedDownloadMethod !== Settings.downloadMethod) {
      Settings.downloadMethod = selectedDownloadMethod;
    }
  }

  let selectedTableOption = Settings.downloadOption;
  let selectedLocaleOffset = 100;
  const tableOptions = [
    {
      text: "All Locales",
      value: DownloadOption.AllLocales,
    },
    {
      text: `Primary Locale (${getDisplayName(
        getLocaleData(project.primaryLocale)
      )})`,
      value: DownloadOption.PrimaryLocale,
    },
    ...[
      ...project.allLocales
        .filter((locale) => locale !== project.primaryLocale)
        .map((locale) => {
          return {
            text: getDisplayName(getLocaleData(locale)),
            value: selectedLocaleOffset + locale,
          };
        }),
    ].sort((a, b) => {
      if (a.text > b.text) return 1;
      if (a.text < b.text) return -1;
      return 0;
    }),
  ];
  $: {
    if (selectedTableOption !== Settings.downloadOption) {
      if (selectedTableOption in DownloadOption)
        Settings.downloadOption = selectedTableOption;
    }
  }

  let selectedNamingConvention = Settings.namingConvention;
  const namingOptions = [
    {
      text: "S4S",
      value: NamingConvention.S4S,
    },
    {
      text: "S4PI",
      value: NamingConvention.S4PI,
    },
    {
      text: "Project Name",
      value: NamingConvention.NameOnly,
    },
  ];
  $: {
    if (selectedNamingConvention !== Settings.namingConvention) {
      if (selectedNamingConvention in NamingConvention)
        Settings.namingConvention = selectedNamingConvention;
    }
  }

  const keySubscriptions = [
    subscribeToKey("Escape", onComplete),
    subscribeToKey("Enter", downloadStrings),
  ];

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  async function downloadStrings() {
    isDownloading = true;
    const locales = getStringTableLocales();
    downloadInfo = await project.getDownloadInfo(
      selectedDownloadMethod,
      locales
    );
  }

  function getStringTableLocales(): StringTableLocale[] {
    switch (selectedTableOption) {
      case DownloadOption.AllLocales:
        return project.allLocales;
      case DownloadOption.PrimaryLocale:
        return [project.primaryLocale];
      default:
        return [selectedTableOption - selectedLocaleOffset];
    }
  }
</script>

<MultipageModalContent
  title="Download Strings"
  numPages={1}
  completePages={1}
  currentPage={1}
  finalPageNextButtonText="Download"
  onNextButtonClick={downloadStrings}
>
  <div slot="content">
    <div class="selects flex-space-between flex-gap my-1">
      <Select
        label="download as"
        name="download-type-select"
        bind:selected={selectedDownloadMethod}
        options={downloadMethods}
        fillWidth={true}
      />
      <Select
        label="stbl(s) to download"
        name="download-tables-select"
        bind:selected={selectedTableOption}
        options={tableOptions}
        fillWidth={true}
      />
      <Select
        label="naming convention"
        name="naming-convention-select"
        bind:selected={selectedNamingConvention}
        options={namingOptions}
        fillWidth={true}
        disabled={selectedDownloadMethod === DownloadMethod.Package}
      />
    </div>
    <p class="subtle-text mt-2 mb-0">
      Click "Download" or press enter to download your file(s). If there are
      multiple files, they will be zipped.
    </p>
  </div>
</MultipageModalContent>

{#if isDownloading && downloadInfo != undefined}
  <Downloader
    contentGenerator={() => downloadInfo.data}
    filename={downloadInfo?.filename ?? "STBLs"}
    onDownload={onComplete}
  />
{/if}

<style lang="scss">
  @media only screen and (max-width: 768px) {
    .selects {
      flex-direction: column;
      width: 100%;
    }
  }
</style>
