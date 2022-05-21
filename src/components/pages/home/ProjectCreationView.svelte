<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type Workspace from "../../../models/workspace";
  import { allLocales } from "../../../services/localization";
  import StorageService from "../../../services/storage";
  import { validateHexString } from "../../../services/validation";
  import { activeWorkspace } from "../../../services/stores";
  import GradientHeader from "../../shared/GradientHeader.svelte";
  import SelectWithLabel from "../../shared/SelectWithLabel.svelte";
  import TextInput from "../../shared/TextInput.svelte";

  const { StringTableLocale } = window.S4TK.enums;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  let workspace: Workspace;
  activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const localeOptions = allLocales.map((data) => {
    return {
      value: data.enumValue,
      text: `${data.englishName} (${data.nativeName})`,
    };
  });

  let uuid: string = uuidv4();
  let name = "";
  let primaryLocale = StorageService.settings.defaultLocale;
  let group = 0;
  let groupString = formatAsHexString(0, 8, false);
  let instanceBase = fnv64(uuid) & 0xffffffffffffffn;
  let instanceBaseString = formatAsHexString(instanceBase, 14, false);

  let isNameValid = false;
  let isGroupValid = false;
  let isInstanceValid = false;

  $: isEverythingValid = isNameValid && isGroupValid && isInstanceValid;

  // $: groupString = formatAsHexString(group, 8, false);
  // $: instanceBaseString = formatAsHexString(instanceBase, 14, false);
</script>

<div class="project-creation-view">
  <GradientHeader title="New Project" />
  <p class="mt-1 mb-0 subtle-text">UUID: {uuid}</p>
  <form class="w-100">
    <TextInput
      name="project-name-text-input"
      fillWidth={true}
      label="project name"
      placeholder="Project name..."
      bind:value={name}
      isValid={isNameValid}
      validators={[
        {
          error: "Must be non-empty",
          test(value) {
            return Boolean(value);
          },
        },
        {
          error: "Must be <= 40 characters",
          test(value) {
            return value.length <= 40;
          },
        },
        {
          error: "Project name already in use",
          test(value) {
            if (!workspace) return true;
            return !Boolean(workspace.projects.find((p) => p.name === value));
          },
        },
      ]}
    />
    <TextInput
      monospace={true}
      name="group-text-input"
      label="group"
      placeholder="Group..."
      bind:value={groupString}
      isValid={isGroupValid}
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
      label="instance base"
      placeholder="Instance base..."
      bind:value={instanceBaseString}
      isValid={isInstanceValid}
      validators={[
        {
          error: "Must be valid 14-digit hex",
          test(value) {
            return validateHexString(value, 14);
          },
        },
      ]}
    />
    <SelectWithLabel
      name="primary-locale-select"
      label="primary locale"
      bind:selected={primaryLocale}
      options={localeOptions}
    />
  </form>
</div>

<style lang="scss">
  // intentionally blank
</style>
