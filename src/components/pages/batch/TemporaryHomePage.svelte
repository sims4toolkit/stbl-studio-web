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
    <p class="mt-2">
      This website is going to replace <a
        href="https://frankkmods.com/#/ts4-tools/stbl-editor"
        target="_blank">the current string table editor</a
      >.
    </p>
    <p class="mb-0">
      It is not ready yet, but was published early to host
      <a href="/batch-fix/pronouns" use:link>the pronoun batch fix tool</a>.
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
