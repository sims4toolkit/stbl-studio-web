<script lang="ts">
  import { onDestroy } from "svelte";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import LocaleSelect from "./LocaleSelect.svelte";
  import TextInput from "../elements/TextInput.svelte";
  import { validateHexString } from "../../typescript/helpers/tgi";
  import type Workspace from "../../typescript/models/workspace";
  import { activeWorkspace } from "../../typescript/stores";

  export let uuid: string = null;
  export let groupHexString: string;
  export let isGroupValid = true;
  export let instanceHexString: string;
  export let isInstanceValid = true;
  export let selectedLocale: StringTableLocale;
  export let canValidate = true;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="gil-inputs flex-space-between">
  <TextInput
    name="group-text-input"
    fillWidth={true}
    label="group"
    placeholder="Group..."
    bind:value={groupHexString}
    bind:isValid={isGroupValid}
    monospace={true}
    validators={[
      {
        error: "Must be 8-digit hex",
        test(value) {
          return validateHexString(value, 8);
        },
      },
    ]}
    warnings={[
      {
        error: "80000000 recommended",
        test(value) {
          return value === "80000000";
        },
      },
    ]}
  />
  <TextInput
    name="instance-text-input"
    fillWidth={true}
    label="instance"
    placeholder="Instance..."
    bind:value={instanceHexString}
    bind:isValid={isInstanceValid}
    monospace={true}
    validators={[
      {
        error: "Must be 14-digit hex",
        test(value) {
          return validateHexString(value, 14);
        },
      },
      {
        error: "Must be non-zero",
        test(value) {
          return value !== "00000000000000";
        },
      },
      {
        error: "Already in use",
        test(value) {
          if (!workspace) return true;
          const instanceBaseNumber = BigInt("0x" + value);
          return !workspace.projects.some(
            // canValidate is a hack to solve a visual glitch where the instance
            // will temporarily be shown as invalid after creating the project
            (p) => {
              if (p.uuid === uuid) return false;
              return canValidate && p.instanceBase === instanceBaseNumber;
            }
          );
        },
      },
    ]}
  />
  <LocaleSelect
    name="primary-locale-select"
    label="primary locale"
    fillWidth={true}
    bind:selectedLocale
  />
</div>

<style lang="scss">
  .gil-inputs {
    gap: 1em;
  }

  @media only screen and (max-width: 768px) {
    .gil-inputs {
      flex-direction: column;
      width: 100%;
    }
  }
</style>
