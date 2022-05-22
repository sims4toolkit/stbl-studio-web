<script lang="ts">
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "../../../models/project";
  import type Workspace from "../../../models/workspace";
  import { activeWorkspace } from "../../../services/stores";
  import ContentArea from "../../layout/ContentArea.svelte";
  import GradientHeader from "../../shared/GradientHeader.svelte";
  import NavigationButton from "../../shared/NavigationButton.svelte";

  export let params: { uuid: string };

  let workspace: Workspace;
  let project: Project;

  activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      project = workspace.projects.find(({ uuid }) => uuid === params.uuid);
    }
  });

  function onBackClicked() {
    replace("/");
  }
</script>

<svelte:head>
  <title>STBL | {project?.name ?? "Loading..."}</title>
</svelte:head>
<section id="project-section">
  {#if Boolean(project)}
    <ContentArea banded={true}>
      <div class="flex-center-v flex-space-between mb-2">
        <NavigationButton text="Back" onClick={onBackClicked} />
        <GradientHeader title={project.name} />
      </div>
      {params.uuid}
    </ContentArea>
    <ContentArea banded={false}>
      {params.uuid}
    </ContentArea>
  {/if}
</section>

<style lang="scss">
  #project-section {
    padding-top: 50px;
    min-height: 100vh;
  }
</style>
