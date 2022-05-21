<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type Workspace from "../../../models/workspace";
  import { allLocales } from "../../../services/localization";
  import { activeWorkspace } from "../../../services/stores";
  import GradientHeader from "../../shared/GradientHeader.svelte";
  import TextInput from "../../shared/TextInput.svelte";

  const { StringTableLocale } = window.S4TK.enums;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  let uuid: string = uuidv4();
  let name = "";
  // let group = 0;
  let groupString = formatAsHexString(0, 8, false);
  let primaryLocale = StringTableLocale.English;
  // let instanceBase = fnv64(uuid) & 0xffffffffffffffn;
  let instanceBaseString = formatAsHexString(0, 14, false);

  let workspace: Workspace;
  activeWorkspace.subscribe((value) => {
    workspace = value;
  });

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
      isValid={false}
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
      label="Group"
      placeholder="Group..."
      bind:value={groupString}
      isValid={false}
      validators={[
        {
          error: "Must be valid 8-digit hex",
          test(value) {
            return false;
          },
        },
      ]}
    />
    <input
      class="tgi-input"
      type="text"
      placeholder="Instance Base..."
      bind:value={instanceBaseString}
    />
    <label for="primary-locale-select">Primary Locale</label>
    <select
      name="primary-locale-select"
      id="primary-locale-select"
      bind:value={primaryLocale}
    >
      {#each allLocales as localeData, key (key)}
        <option value={localeData.enumValue}>
          {localeData.englishName}
          {#if localeData.enumValue !== StringTableLocale.English}
            ({localeData.nativeName})
          {/if}
        </option>
      {/each}
    </select>
  </form>
</div>

<style lang="scss">
  .project-creation-view {
    .tgi-input,
    .tgi-input::placeholder {
      font-family: monospace;
    }
  }
</style>
