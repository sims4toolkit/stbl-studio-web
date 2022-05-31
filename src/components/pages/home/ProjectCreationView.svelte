<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type Workspace from "../../../typescript/models/workspace";
  import Project from "../../../typescript/models/project";
  import {
    allLocales,
    getLocaleData,
  } from "../../../typescript/helpers/localization";
  import { hashInstanceBase } from "../../../typescript/helpers/tgi";
  import { activeWorkspace } from "../../../typescript/stores";
  import TextInput from "../../shared/elements/TextInput.svelte";
  import LocaleCheckboxesView from "./LocaleCheckboxesView.svelte";
  import type { LocaleData } from "../../../global";
  import { Settings } from "../../../typescript/storage";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";
  import GroupInstanceLocale from "../../shared/controls/GroupInstanceLocale.svelte";

  const { formatAsHexString } = window.S4TK.formatting;

  //#region General

  export let onComplete: () => void;

  const uuid = uuidv4();
  let currentPage = 1;
  let completePages = 1;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  onDestroy(() => {
    unsubscribe();
  });

  //#endregion General

  //#region Page 1

  let name = "";
  let isNameValid = false;
  let groupHexString = "80000000";
  let isGroupValid = false;
  let instanceHexString = formatAsHexString(hashInstanceBase(uuid), 14, false);
  let isInstanceValid = false;
  let primaryLocale = Settings.defaultLocale;

  $: isPage1Valid = isNameValid && isGroupValid && isInstanceValid;

  $: {
    completePages = currentPage + (isPage1Valid ? 0 : -1);
  }

  //#endregion Page 1

  //#region Page 2

  let otherLocaleOptions: {
    data: LocaleData;
    checked: boolean;
  }[];

  //#endregion Page 2

  //#region Functions

  function nextButtonClicked() {
    if (currentPage === 1) {
      otherLocaleOptions = allLocales
        .filter((data) => data.enumValue !== primaryLocale)
        .map((data) => {
          return {
            data,
            checked: false,
          };
        });

      currentPage++;
    } else {
      createProjectAndClose();
    }
  }

  function createProjectAndClose() {
    workspace.addProject(
      new Project(
        {
          uuid,
          name: name.trim(),
          primaryLocale,
          group: parseInt(groupHexString, 16),
          instanceBase: BigInt("0x" + instanceHexString),
        },
        new Map(),
        otherLocaleOptions
          .filter((option) => option.checked)
          .map((option) => option.data.enumValue)
      )
    );

    onComplete();
  }

  //#endregion Functions
</script>

<MultipageModalContent
  title="New Project"
  subtitle="UUID: {uuid}"
  numPages={2}
  minimumContentHeight="230"
  bind:currentPage
  bind:completePages
  finalPageNextButtonText="Create"
  onNextButtonClick={nextButtonClicked}
>
  <div slot="content">
    {#if currentPage === 1}
      <div>
        <form class="w-100 mb-2">
          <TextInput
            name="project-name-text-input"
            focusOnMount={true}
            fillWidth={true}
            label="project name"
            placeholder="Project name..."
            bind:value={name}
            bind:isValid={isNameValid}
            validators={[
              {
                error: "Must be non-empty",
                test(value) {
                  return Boolean(value.trim());
                },
              },
              {
                error: "Must be <= 30 characters",
                test(value) {
                  return value.length <= 30;
                },
              },
              {
                error: "Already in use",
                test(value) {
                  if (!workspace) return true;
                  const formattedName = value.trim().toLowerCase();
                  return !workspace.projects.some((p) => {
                    if (p.uuid === uuid) return false;
                    return p.name.trim().toLowerCase() === formattedName;
                  });
                },
              },
            ]}
          />
          <div class="mt-1">
            <GroupInstanceLocale
              bind:groupHexString
              bind:isGroupValid
              bind:instanceHexString
              bind:isInstanceValid
              bind:selectedLocale={primaryLocale}
            />
          </div>
        </form>
        <div>
          <p class="subtle-text mt-0 mb-half">
            The instance is a hash of the UUID by default, but it can be changed
            manually.
          </p>
          <p class="subtle-text my-0">
            The 2-digit locale code will automatically be prepended to the
            instance.
          </p>
        </div>
      </div>
    {:else}
      <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}>
        <p class="mb-2">
          Select additional locales to include in this project. Strings added to
          your primary locale ({getLocaleData(primaryLocale).englishName}) will
          automatically be added to these ones as well.
        </p>
        <LocaleCheckboxesView bind:localeChoices={otherLocaleOptions} />
      </div>
    {/if}
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>
