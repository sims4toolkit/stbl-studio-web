<script lang="ts">
  import { link } from "svelte-spa-router";
  import ContentArea from "../../layout/ContentArea.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="temporary-home-page">
  <ContentArea>
    <GradientHeader title="Under Construction" />
    <p>
      This website is not ready. I didn't plan on making it public yet, but the
      pronoun update threw a wrench in my plans.
    </p>
    <p>
      For now, use the <a href="/batch-fix/pronouns" use:link
        >Pronoun Batch Fix</a
      > tool to fix your string tables.
    </p>
  </ContentArea>
</section>

<style lang="scss">
  section#temporary-home-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
