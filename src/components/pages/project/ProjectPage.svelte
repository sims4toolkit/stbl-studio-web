<script lang="ts">
  import { onDestroy } from "svelte";
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "../../../typescript/models/project";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import ContentArea from "../../layout/ContentArea.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";

  export let params: { uuid: string };

  let project: Project;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    if (value) {
      workspace = value;
      project = workspace.projects.find(({ uuid }) => uuid === params.uuid);
    }
  });

  onDestroy(() => {
    unsubscribe();
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
      <GradientHeader title={project.name} />
      {params.uuid}
    </ContentArea>
    <ContentArea banded={false}>
      {params.uuid}
    </ContentArea>
  {/if}
</section>

<style lang="scss">
  // intentionally blank
</style>
