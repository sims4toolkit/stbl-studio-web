<script lang="ts">
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import type Project from "../../../models/project";
  import ContentArea from "../../layout/ContentArea.svelte";
  import NavigationButton from "../../shared/NavigationButton.svelte";

  export let params: { id: string };
  let project: Project;

  onMount(() => {
    project = undefined;
  });

  function onBackClicked() {
    replace("/");
  }
</script>

<svelte:head>
  <title>STBL | {params.id}</title>
</svelte:head>
<section id="project-section">
  <ContentArea banded={true}>
    <div class="flex-center-v flex-space-between mb-2">
      <NavigationButton text="Back" onClick={onBackClicked} />
      <h2 class="my-0 accent-color nowrap-truncate ml-2 text-shadow">
        {project?.name ?? "Language Barriers"}
      </h2>
    </div>
    {params.id}
  </ContentArea>
  <ContentArea banded={false}>
    {params.id}
  </ContentArea>
</section>

<style lang="scss">
  #project-section {
    padding-top: 50px;
    min-height: 100vh;
  }
</style>
