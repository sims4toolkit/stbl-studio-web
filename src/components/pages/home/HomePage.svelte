<script lang="ts">
  import ContentArea from "../../shared/ContentArea.svelte";
  import FloatingActionButtons from "../../shared/FloatingActionButtons.svelte";
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="home">
  <ContentArea banded={false}>
    <slot>First</slot>
  </ContentArea>
  <ContentArea banded={true}>
    <slot>Second</slot>
  </ContentArea>
</section>
<FloatingActionButtons />

<style lang="scss">
  // intentionally blank
</style>
