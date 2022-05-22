<script lang="ts">
  import ContentArea from "../layout/ContentArea.svelte";
  import GradientHeader from "../shared/GradientHeader.svelte";

  // just silencing warnings in a hacky way, don't mind me
  export let params: any;
  if (false) console.log(params);
</script>

<svelte:head>
  <title>Page Not Found</title>
</svelte:head>
<section id="page-not-found">
  <ContentArea>
    <GradientHeader title="Unlock this page for $4.04" />
    <p>
      Just kidding. This page doesn't exist. Please <a href="/">go home</a>.
    </p>
    <p class="disclaimer">Error 404</p>
  </ContentArea>
</section>

<style lang="scss">
  section#page-not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .disclaimer {
      margin-top: 4em;
    }
  }
</style>
