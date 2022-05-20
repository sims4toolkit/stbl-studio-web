<script lang="ts">
  import { onMount } from "svelte";
  import type { StblProject } from "../../../global";
  import ContentArea from "../../layout/ContentArea.svelte";
  import BackButton from "../../shared/BackButton.svelte";

  export let params: { id: string };
  let project: StblProject;

  onMount(() => {
    project = undefined;
  });
</script>

<svelte:head>
  <title>STBL | {params.id}</title>
</svelte:head>
<section id="project-section">
  <ContentArea banded={true}>
    <div class="flex-center-v flex-space-between mb-2">
      <BackButton />
      <h2 class="my-0 accent-color nowrap-truncate ml-2">
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
