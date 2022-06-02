<script lang="ts">
  import { onDestroy } from "svelte";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import TextInput from "../../shared/elements/TextInput.svelte";

  export let uuid: string;
  export let name: string;
  export let isNameValid: boolean;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

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

<style lang="scss">
  // intentionally blank
</style>
