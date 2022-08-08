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
  import Select from "../../shared/elements/Select.svelte";

  const { formatAsHexString } = window.S4TK.formatting;
  const { fnv64 } = window.S4TK.hashing;
  const { StringTableLocale } = window.S4TK.enums;

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

  let defaultInstanceStringMsg: string;
  let chosenInstance: bigint = null;
  let choosingExistingInstance = false;
  let existingInstanceOptions: {
    value: bigint;
    text: string;
  }[];

  $: numStrings = stblMap?.get(primaryLocale)?.size ?? 0;
  $: numLocales = stblMap?.size ?? 0;

  $: {
    if (settingMetaData) {
      completePages = 1 + (isMetaDataValid || choosingExistingInstance ? 1 : 0);
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

  function timeout(ms = 500) {
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

    let hasBeen500ms = false;
    setTimeout(() => (hasBeen500ms = true), 500);
    parseResult = await parseFiles(uploadedFiles);
    if (!hasBeen500ms) await timeout();

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

    let hasBeen500ms = false;
    setTimeout(() => (hasBeen500ms = true), 500);

    const defaultMetaData = getDefaultMetaData(parseResult.stbls);
    primaryLocale = defaultMetaData.primaryLocale;
    otherLocaleOptions = defaultMetaData.otherLocaleOptions;
    groupHexString = formatAsHexString(defaultMetaData.group, 8);

    if (defaultMetaData.existingInstances.size >= 1) {
      chosenInstance = defaultMetaData.existingInstances.values().next().value;
      if (defaultMetaData.existingInstances.size > 1) {
        choosingExistingInstance = true;
        existingInstanceOptions = [...defaultMetaData.existingInstances].map(
          (inst) => ({
            text: formatAsHexString(inst, 14, false),
            value: inst,
          })
        );
      } else {
        useChosenInstance();
      }
    } else {
      hashUuidForInstance();
    }

    if (!hasBeen500ms) await timeout();

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
        otherLocaleOptions
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
      if (choosingExistingInstance) {
        useChosenInstance();
      } else {
        otherLocaleOptions = otherLocaleOptions.filter(
          (o) => o.data.enumValue !== primaryLocale
        );
        metaDataPage++;
        currentPage++;
        completePages++;
      }
    } else if (currentPage === 3) {
      settingMetaData = false;
      currentPage++;
      prepareProject();
    } else {
      createProjectAndClose();
    }
  }

  function useChosenInstance() {
    defaultInstanceStringMsg = "from an existing STBL";
    instanceHexString = formatAsHexString(chosenInstance, 14, false);
    choosingExistingInstance = false;
  }

  function hashUuidForInstance() {
    instanceHexString = formatAsHexString(
      StringTableLocale.getInstanceBase(fnv64(uuid)),
      14,
      false
    );

    choosingExistingInstance = false;
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
        </div>
      {:else if choosingExistingInstance}
        <p class="mt-0 mb-2">
          There are {existingInstanceOptions.length} instance bases in the uploaded
          STBLs. Which one should this project use?
        </p>
        <Select
          name="existing-inst-select"
          label="instance base"
          bind:selected={chosenInstance}
          options={existingInstanceOptions}
          fillWidth={true}
        />
        <p class="subtle-text mt-3 mb-0">
          Alternatively, you can <span
            tabindex="0"
            class="clickable-text hoverable"
            on:click={hashUuidForInstance}>hash this project's UUID</span
          >.
        </p>
      {:else}
        <ProjectMetaDataPages
          {uuid}
          currentPage={metaDataPage}
          defaultInstanceString={defaultInstanceStringMsg}
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
      </div>
    {:else}
      <div in:fade>
        <h3>All set!</h3>
        <p>
          A project with {numStrings} strings in {numLocales} locales has been created.
        </p>
      </div>
    {/if}
  </div>
</MultipageModalContent>
