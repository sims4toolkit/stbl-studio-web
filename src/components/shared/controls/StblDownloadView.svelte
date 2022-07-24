<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import { onDestroy } from "svelte";
  import type { FileDownloadInfo } from "../../../global";
  import DownloadMethod from "../../../typescript/enums/download-method";
  import DownloadOption, {
    LOCALE_OFFSET,
  } from "../../../typescript/enums/download-options";
  import NamingConvention from "../../../typescript/enums/naming-convention";
  import { getDownloadInfoForProjects } from "../../../typescript/helpers/downloads";
  import {
    getDisplayName,
    getLocaleData,
  } from "../../../typescript/helpers/localization";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import type Project from "../../../typescript/models/project";
  import { Settings } from "../../../typescript/storage";
  import Select from "../elements/Select.svelte";
  import MultipageModalContent from "../layout/MultipageModalContent.svelte";
  import Downloader from "./Downloader.svelte";

  //#region Variables

  export let projects: Project[];
  export let onComplete: () => void;

  const primaryLocale =
    projects.length === 1 ? projects[0].primaryLocale : null;

  let selectedDownloadMethod = Settings.downloadMethod;
  let selectedLocaleOption = Settings.downloadOption;
  let selectedNamingConvention = Settings.namingConvention;
  let isDownloading = false;
  let downloadInfo: FileDownloadInfo;

  const otherLocalesSet = new Set<StringTableLocale>();
  projects.forEach((project) => {
    project.allLocales.forEach((locale) => {
      if (locale !== primaryLocale) otherLocalesSet.add(locale);
    });
  });
  const otherLocales = [...otherLocalesSet];

  //#endregion Variables

  //#region Lifecycle Hooks

  const keySubscriptions = [
    subscribeToKey("Escape", onComplete),
    subscribeToKey("Enter", downloadStbls),
  ];

  onDestroy(() => {
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  //#endregion Lifecylce Hooks

  //#region Options

  const downloadMethodOptions = [
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

  const downloadLocaleOptions = [
    {
      text: "All Locales",
      value: DownloadOption.AllLocales,
    },
    {
      text: `Primary Locale (${
        primaryLocale != null ? getEnglishName(primaryLocale) : "Varies"
      })`,
      value: DownloadOption.PrimaryLocale,
    },
    ...otherLocales
      .map((locale) => {
        return {
          text: getEnglishName(locale),
          value: LOCALE_OFFSET + locale,
        };
      })
      .sort((a, b) => {
        if (a.text > b.text) return 1;
        if (a.text < b.text) return -1;
        return 0;
      }),
  ];
  $: {
    if (selectedLocaleOption !== Settings.downloadOption) {
      if (selectedLocaleOption in DownloadOption)
        Settings.downloadOption = selectedLocaleOption;
    }
  }

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

  //#endregion Options

  //#region Functions

  async function downloadStbls() {
    isDownloading = true;
    downloadInfo = await getDownloadInfoForProjects(
      projects,
      selectedDownloadMethod,
      selectedLocaleOption
    );
  }

  async function onDownloadComplete() {
    isDownloading = false;
    onComplete();
  }

  function getEnglishName(locale: StringTableLocale): string {
    return getDisplayName(getLocaleData(locale));
  }

  //#endregion Functions
</script>

<MultipageModalContent
  title="Download String Table(s)"
  numPages={1}
  completePages={1}
  currentPage={1}
  finalPageNextButtonText="Download"
  onNextButtonClick={downloadStbls}
>
  <div slot="content">
    <div class="selects flex-space-between flex-gap my-1">
      <Select
        label="download as"
        name="download-type-select"
        bind:selected={selectedDownloadMethod}
        options={downloadMethodOptions}
        fillWidth={true}
      />
      <Select
        label="stbl(s) to download"
        name="download-tables-select"
        bind:selected={selectedLocaleOption}
        options={downloadLocaleOptions}
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
    onDownload={onDownloadComplete}
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
