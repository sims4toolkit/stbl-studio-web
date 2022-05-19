<script lang="ts">
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";
  import type { StblProject } from "../../../global";
  import ContentArea from "../../layout/ContentArea.svelte";

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
    <a href="/" use:link>Back to Workspace</a>
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
