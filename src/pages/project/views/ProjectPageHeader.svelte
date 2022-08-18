<script lang="ts">
  import type Project from "src/lib/models/project";
  import ProjectMetaDataView from "src/components/views/ProjectMetaDataView.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import MetaDataEditingView from "./MetaDataEditingView.svelte";
  const { formatAsHexString } = window.S4TK.formatting;

  export let project: Project;

  let editingProject = false;
</script>

<button title="Edit Project" on:click={() => (editingProject = true)}>
  <div
    class="pt-10 px-4 w-full flex justify-center bg-gray-200 dark:bg-gray-900 bottom-shadow"
  >
    <div
      class="w-full xl:max-w-screen-xl py-6 flex justify-between flex-wrap lg:flex-nowrap gap-8"
    >
      <div class="overflow-hidden text-left">
        <h2
          class="font-bold text-xl text-gradient drop-shadow whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {project.metaData.name}
        </h2>
        <p class="text-xs mt-1 text-subtle monospace">
          {formatAsHexString(project.metaData.instance, 14, false)}
        </p>
      </div>
      <div class="flex-1 sm:max-w-sm">
        <ProjectMetaDataView {project} />
      </div>
    </div>
  </div>
</button>

{#if editingProject}
  <BlurOverlay onClose={() => (editingProject = false)}>
    <MetaDataEditingView
      bind:project
      onComplete={() => (editingProject = false)}
    />
  </BlurOverlay>
{/if}
