<script lang="ts">
  import { link } from "svelte-spa-router";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../elements/SectionHeader.svelte";
  import StorageUsageView from "../../views/StorageUsageView.svelte";

  const discordLink = "https://discord.gg/qNhD3Jh";
</script>

<svelte:head>
  <title>STBL Studio | Help</title>
</svelte:head>
<section id="help-page">
  <ContentArea>
    <SectionHeader title="Placeholder" />
    <p>Placeholder</p>
    <StorageUsageView />
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
