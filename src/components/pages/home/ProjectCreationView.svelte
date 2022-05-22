<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type Workspace from "../../../typescript/models/workspace";
  import Project from "../../../typescript/models/project";
  import {
    allLocales,
    getDisplayName,
    getLocaleData,
  } from "../../../typescript/helpers/localization";
  import StorageService from "../../../typescript/storage-service";
  import {
    hashInstanceBase,
    validateHexString,
  } from "../../../typescript/helpers/tgi";
  import { activeWorkspace } from "../../../typescript/stores";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import Select from "../../elements/Select.svelte";
  import TextInput from "../../elements/TextInput.svelte";
  import ProgressCircles from "../../elements/ProgressCircles.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";
  import LocaleCheckboxesView from "./LocaleCheckboxesView.svelte";
  import type { LocaleData } from "../../../global";

  const { formatAsHexString } = window.S4TK.formatting;
  const { StringTableResource } = window.S4TK.models;

  const animationDuration = 1000;

  export let onComplete: (project?: Project) => void;

  let workspace: Workspace;
  activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const localeOptions = allLocales.map((data) => {
    return {
      value: data.enumValue,
      text: getDisplayName(data),
    };
  });

  let page: "tgi" | "locales" = "tgi";
  let uuid: string = uuidv4();
  let name = "";
  let primaryLocale = StorageService.settings.defaultLocale;
  let groupString = "80000000";
  let instanceBaseString = formatAsHexString(
    hashInstanceBase(uuid, false), // UUID is already unique
    14,
    false
  );

  let isNameValid = false;
  let isGroupValid = false;
  let isInstanceValid = false;
  let otherLocaleOptions: {
    data: LocaleData;
    checked: boolean;
  }[];

  $: isEverythingValid = isNameValid && isGroupValid && isInstanceValid;
  $: circlesFilled = (isEverythingValid ? 1 : 0) + (page === "locales" ? 1 : 0);
  $: nextButtonText = page === "tgi" ? "Next" : "Create";

  function hashName() {
    instanceBaseString = formatAsHexString(hashInstanceBase(name), 14, false);
  }

  function nextButtonClicked() {
    if (page === "tgi") {
      otherLocaleOptions = allLocales
        .filter((data) => data.enumValue !== primaryLocale)
        .map((data) => {
          return {
            data,
            checked: false,
          };
        });

      page = "locales";
    } else {
      createProjectAndClose();
    }
  }

  function createProjectAndClose() {
    const stbls = [
      {
        locale: primaryLocale,
        stbl: new StringTableResource(),
      },
    ];

    otherLocaleOptions.forEach((option) => {
      if (option.checked) {
        stbls.push({
          locale: option.data.enumValue,
          stbl: new StringTableResource(),
        });
      }
    });

    const project = new Project({
      uuid,
      name,
      primaryLocale,
      group: parseInt(groupString, 16),
      instanceBase: BigInt("0x" + instanceBaseString),
      stbls,
    });

    onComplete(project);
  }
</script>

<div class="project-creation-view">
  <div in:fly={{ y: -15, duration: animationDuration }}>
    <GradientHeader title="New Project" />
    <p class="mt-1 subtle-text">UUID: {uuid}</p>
  </div>
  {#if page === "tgi"}
    <form class="w-100 my-2" in:fly={{ y: 15, duration: animationDuration }}>
      <TextInput
        name="project-name-text-input"
        fillWidth={true}
        label="project name"
        placeholder="Project name..."
        bind:value={name}
        bind:isValid={isNameValid}
        validators={[
          {
            error: "Must be non-empty",
            test(value) {
              return Boolean(value);
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
              return !workspace.projects.some(
                (p) => p.uuid !== uuid && p.name === value
              );
            },
          },
        ]}
      />
      <div class="mt-1 tgi-inputs flex-space-between">
        <TextInput
          name="group-text-input"
          fillWidth={true}
          label="group"
          placeholder="Group..."
          bind:value={groupString}
          bind:isValid={isGroupValid}
          validators={[
            {
              error: "Must be 8-digit hex",
              test(value) {
                return validateHexString(value, 8);
              },
            },
          ]}
        />
        <TextInput
          name="instance-text-input"
          fillWidth={true}
          label="instance"
          placeholder="Instances..."
          bind:value={instanceBaseString}
          bind:isValid={isInstanceValid}
          validators={[
            {
              error: "Must be 14-digit hex",
              test(value) {
                return validateHexString(value, 14);
              },
            },
            {
              error: "Already in use",
              test(value) {
                if (!workspace) return true;
                const instanceBaseNumber = BigInt("0x" + value);
                return !workspace.projects.some(
                  (p) =>
                    p.uuid !== uuid && p.instanceBase === instanceBaseNumber
                );
              },
            },
          ]}
        />
        <Select
          name="primary-locale-select"
          label="primary locale"
          fillWidth={true}
          bind:selected={primaryLocale}
          options={localeOptions}
        />
      </div>
    </form>
    <div in:fly={{ y: 25, duration: animationDuration }}>
      <p class="subtle-text">
        The 2-digit locale code will automatically be appended to the instance.
      </p>
      <p class="subtle-text">
        The instance is a hash of the UUID by default, but it can be changed. <span
          class="hash-name"
          on:click={hashName}>Click here to hash its name</span
        >.
      </p>
    </div>
  {:else if page === "locales"}
    <div in:fade>
      <p class="mt-2 mb-0">Select the locales to include in this project.</p>
      <div class="my-2">
        <LocaleCheckboxesView bind:localeChoices={otherLocaleOptions} />
      </div>
      <p class="subtle-text">
        Strings added to your primary locale ({getLocaleData(primaryLocale)
          .englishName}) will automatically be added to these ones as well.
      </p>
    </div>
  {/if}
  <div
    class="flex-space-between mt-2"
    in:fly={{ y: 35, duration: animationDuration }}
  >
    <ProgressCircles circles={2} bind:filled={circlesFilled} />
    <NavigationButton
      text={nextButtonText}
      direction="right"
      onClick={nextButtonClicked}
      active={isEverythingValid}
    />
  </div>
</div>

<style lang="scss">
  .project-creation-view {
    .tgi-inputs {
      gap: 1em;
    }

    .hash-name {
      text-decoration: underline;

      &:hover {
        cursor: pointer;
        text-decoration: none;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .project-creation-view {
      .tgi-inputs {
        flex-direction: column;
        width: 100%;
      }
    }
  }
</style>
