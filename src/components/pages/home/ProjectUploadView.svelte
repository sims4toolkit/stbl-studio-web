<script lang="ts">
  import { fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import FileInput from "../../shared/elements/FileInput.svelte";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";
  import {
    getDefaultMetaData,
    mergeAndPruneLocales,
    parseFiles,
  } from "../../../typescript/helpers/uploads";
  import type {
    LocaleOption,
    ParsedFilesResult,
    StblMap,
  } from "../../../global";
  import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
  import ProjectMetaDataPages from "../../shared/controls/ProjectMetaDataPages.svelte";
  import Project from "../../../typescript/models/project";

  const { formatAsHexString } = window.S4TK.formatting;

  export let onComplete: () => void;

  const uuid = uuidv4();
  let uploadedFiles: FileList;
  let filesInvalid = false;
  let currentPage = 1;
  let completePages = 0;
  let readingFiles = false;
  let parseResult: ParsedFilesResult;
  let reviewingErredFiles = false;
  let findingMetaData = false;
  let settingMetaData = false;
  let preparingProject = false;
  let stblMap: StblMap;

  let metaDataPage = 1;
  let isMetaDataValid = false;
  let projectName = "";
  let primaryLocale: StblLocaleType;
  let otherLocaleOptions: LocaleOption[];
  let groupHexString: string;
  let instanceHexString: string;

  $: {
    if (settingMetaData) {
      completePages = 1 + (isMetaDataValid ? 1 : 0);
    }
  }

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);
  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  $: {
    if (uploadedFiles?.length) readFiles();
  }

  function timeout(ms = 800) {
    // Wait times are being artifically inflated for visual reasons. The
    // progress screens are usually instant for small STBLs, which looks like
    // a glitch that the user doesn't have time to read. I think the pleasant
    // viewing experience + information about each step is worth the < 1s wait.
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function readFiles() {
    reviewingErredFiles = false;
    filesInvalid = false;
    readingFiles = true;

    let hasBeen800ms = false;
    setTimeout(() => (hasBeen800ms = true), 800);
    parseResult = await parseFiles(uploadedFiles);
    if (!hasBeen800ms) await timeout();

    if (!parseResult.stbls.length) {
      uploadedFiles = null;
      parseResult = null;
      filesInvalid = true;
      readingFiles = false;
    } else if (parseResult.errors.length) {
      reviewingErredFiles = true;
      completePages = 1;
    } else {
      findMetaData();
    }
  }

  async function findMetaData() {
    currentPage = 2;
    completePages = 1;
    readingFiles = false;
    findingMetaData = true;

    let hasBeen800ms = false;
    setTimeout(() => (hasBeen800ms = true), 800);

    const defaultMetaData = getDefaultMetaData(parseResult.stbls);
    primaryLocale = defaultMetaData.primaryLocale;
    otherLocaleOptions = defaultMetaData.otherLocaleOptions;
    groupHexString = formatAsHexString(defaultMetaData.group, 8);
    instanceHexString = formatAsHexString(defaultMetaData.instanceBase, 14); // FIXME: ensure not 0

    if (!hasBeen800ms) await timeout();

    findingMetaData = false;
    settingMetaData = true;
  }

  async function prepareProject() {
    preparingProject = true;

    let hasBeen800ms = false;
    setTimeout(() => (hasBeen800ms = true), 800);

    const stblPairs = mergeAndPruneLocales(primaryLocale, parseResult.stbls);

    const localesToInclude = new Set<number>();
    localesToInclude.add(primaryLocale);
    otherLocaleOptions.forEach((option) => {
      if (option.checked) localesToInclude.add(option.data.enumValue);
    });

    stblMap = new Map();
    stblPairs.forEach(({ locale, stbl }) => {
      if (localesToInclude.has(locale)) stblMap.set(locale, stbl);
    });

    if (!hasBeen800ms) await timeout();

    preparingProject = false;
    completePages++;
  }

  async function createProjectAndClose() {
    workspace.addProject(
      new Project(
        {
          uuid,
          name: projectName.trim(),
          primaryLocale,
          group: parseInt(groupHexString, 16),
          instanceBase: BigInt("0x" + instanceHexString),
        },
        stblMap,
        otherLocaleOptions // FIXME: needed?
          .filter((option) => option.checked)
          .map((option) => option.data.enumValue)
      )
    );

    onComplete();
  }

  function handleNextButtonClick() {
    if (currentPage === 1) {
      reviewingErredFiles = false;
      findMetaData();
    } else if (currentPage === 2) {
      metaDataPage++;
      currentPage++;
      completePages++;
    } else if (currentPage === 3) {
      settingMetaData = false;
      currentPage++;
      prepareProject();
    } else {
      createProjectAndClose();
    }
  }
</script>

<MultipageModalContent
  title="Upload Project"
  subtitle="UUID: {uuid}"
  canClickBack={false}
  numPages={4}
  {completePages}
  bind:currentPage
  minimumContentHeight="250"
  centerVertically={true}
  finalPageNextButtonText="Add Project"
  onNextButtonClick={handleNextButtonClick}
>
  <div slot="content" class="w-100">
    {#if currentPage === 1}
      {#if !readingFiles}
        <div in:fade>
          <p class="mt-0 mb-2">
            Upload the string table(s) you'd like to include in this project.
            They can be binary, JSON, or in packages. Feel free to upload all of
            the packages for your mod, unneeded files will be ignored.
          </p>
          <FileInput
            focusOnMount={true}
            label="binaries, jsons, and/or packages only"
            bind:files={uploadedFiles}
            accept=".json,.stbl,.bnry,.binary,.package"
            multiple={true}
            bind:filesInvalid
            errorMessage="No valid STBLs found"
          />
          <div class="mt-2">
            <p class="subtle-text mt-0">
              If there are multiple tables for the same language, they will be
              merged. The best way to ensure that multiple languages are handled
              properly is by uploading them in packages.
            </p>
            <p class="subtle-text mb-0">
              Using JSON? Read about the expected structure <a
                href="#/help?title=json"
                target="_blank">here</a
              >.
            </p>
          </div>
        </div>
      {:else if !reviewingErredFiles}
        <div in:fade>
          <h3>Extracting STBLs...</h3>
          <p>This might take a little bit.</p>
        </div>
      {:else}
        <div in:fade>
          <h3 class="mt-0">{parseResult.errors.length} Error(s) Encountered</h3>
          <p>
            Some of your files either could not be read or did not contain valid
            STBL data. Don't worry - you can still create a project from the
            {parseResult.stbls.length} valid STBLs you uploaded.
          </p>
          <ul class="error-summary">
            {#each parseResult.errors as error, key (key)}
              <li>
                <span class="monospace accent-color">{error.filename}</span>
                &nbsp;=&nbsp;{error.reason}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {:else if currentPage <= 3}
      {#if findingMetaData}
        <div in:fade>
          <h3>Finding meta data...</h3>
          <p>This might take a little bit.</p>
        </div>
      {:else}
        <!-- FIXME: "The instance is a hash of the UUID by default, but it can be changed manually." is not accurate for this view -->
        <!-- FIXME: Add warning that unchecking locales will delete those translations from the project -->
        <ProjectMetaDataPages
          {uuid}
          currentPage={metaDataPage}
          bind:isPage1Valid={isMetaDataValid}
          bind:name={projectName}
          bind:primaryLocale
          bind:otherLocaleOptions
          bind:groupHexString
          bind:instanceHexString
        />
      {/if}
    {:else if preparingProject}
      <div in:fade>
        <h3>Preparing your project...</h3>
        <p>This might take a little bit.</p>
      </div>
    {:else}
      <div in:fade>
        <h3>All set!</h3>
        <p>A project with X strings in X locales has been created.</p>
      </div>
    {/if}
  </div>
</MultipageModalContent>

<style lang="scss">
  ul.error-summary {
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
