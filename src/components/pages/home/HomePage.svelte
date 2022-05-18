<script lang="ts">
  import ContentArea from "../../shared/ContentArea.svelte";
</script>

<svelte:head>
  <title>Sims 4 Toolkit</title>
</svelte:head>
<section id="home">
  <ContentArea banded={false}>
    <slot>First</slot>
  </ContentArea>
  <ContentArea banded={true}>
    <slot>Second</slot>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
