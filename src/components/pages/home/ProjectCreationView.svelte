<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type Workspace from "../../../models/workspace";
  import Project from "../../../models/project";
  import {
    allLocales,
    getDisplayName,
    getLocaleData,
  } from "../../../services/localization";
  import StorageService from "../../../services/storage";
  import { hashInstanceBase, validateHexString } from "../../../services/tgi";
  import { activeWorkspace } from "../../../services/stores";
  import GradientHeader from "../../shared/GradientHeader.svelte";
  import SelectWithLabel from "../../shared/SelectWithLabel.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import ProgressCircles from "../../shared/ProgressCircles.svelte";
  import NavigationButton from "../../shared/NavigationButton.svelte";
  import StickyCloseButton from "../../shared/StickyCloseButton.svelte";
  import LocaleCheckboxesView from "../../views/LocaleCheckboxesView.svelte";
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
            error: "Project name already in use",
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
          monospace={true}
          name="group-text-input"
          fillWidth={true}
          label="group"
          placeholder="Group..."
          bind:value={groupString}
          bind:isValid={isGroupValid}
          validators={[
            {
              error: "Must be valid 8-digit hex",
              test(value) {
                return validateHexString(value, 8);
              },
            },
          ]}
        />
        <TextInput
          monospace={true}
          name="instance-text-input"
          fillWidth={true}
          label="instance base"
          placeholder="Instance base..."
          bind:value={instanceBaseString}
          bind:isValid={isInstanceValid}
          validators={[
            {
              error: "Must be valid 14-digit hex",
              test(value) {
                return validateHexString(value, 14);
              },
            },
            {
              error: "Instance base already in use",
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
        <SelectWithLabel
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
      <p class="mt-2 mb-1">Select the locales to include in this project.</p>
      <LocaleCheckboxesView bind:localeChoices={otherLocaleOptions} />
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
<StickyCloseButton onClick={() => onComplete()} />

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
