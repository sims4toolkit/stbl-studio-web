<script lang="ts">
  import { onDestroy } from "svelte";
  import type Project from "src/lib/models/project";
  import type Workspace from "src/lib/models/workspace";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";

  export let onComplete: () => void;
  export let projects: Project[];

  let workspace: Workspace;
  let inputValue = "";
  let multipageState = {
    currentPage: 1,
    nextButtonEnabled: false,
  };

  const subscriptions = [
    activeWorkspaceStore.subscribe((wk) => {
      if (wk) workspace = wk;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function deleteProjects() {
    workspace.deleteProjects(projects);
    onComplete();
  }

  function quantityText(project: Project): string {
    if (project.metaData.numEntries === 1) {
      return "1 string";
    } else {
      return `${project.metaData.numEntries} strings`;
    }
  }
</script>

<MultipageContentGroup
  title="Delete Projects"
  numPages={1}
  centerVertically={true}
  bind:state={multipageState}
  completeButton="Delete"
  onLastPageComplete={deleteProjects}
>
  <div slot="content" class="w-full">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div>
        <p class="mb-4">
          Are you sure you want to permanently delete the following projects?
        </p>
        <div class="max-h-16 overflow-x-hidden overflow-y-auto">
          <ul class="list-disc pl-8 flex flex-col">
            {#each projects as project, key (key)}
              <li class="pl-2">
                {project.metaData.name} ({quantityText(project)})
              </li>
            {/each}
          </ul>
        </div>
        <div class="my-6">
          <TextInput
            label={'type "delete" to confirm'}
            name="deletion-confirmation-input"
            bind:value={inputValue}
            bind:isValid={multipageState.nextButtonEnabled}
            placeholder="Delete"
            focusOnMount={true}
            fillWidth={true}
            validators={[
              {
                test: (value) => value.toLowerCase().trim() === "delete",
                message: 'Value must be "Delete"',
              },
            ]}
          />
        </div>
        <p class="text-subtle text-xs">
          Deleted projects cannot be recovered. Once they're gone, they're gone.
        </p>
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>
