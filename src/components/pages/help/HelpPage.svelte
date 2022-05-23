<script lang="ts">
  import { link } from "svelte-spa-router";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../elements/SectionHeader.svelte";
  import StorageUsageView from "./StorageUsageView.svelte";

  const discordLink = "https://discord.gg/qNhD3Jh";
</script>

<svelte:head>
  <title>S4TK | Help</title>
</svelte:head>
<section id="help-page">
  <ContentArea banded={true}>
    <StorageUsageView />
    <p class="subtle-text">
      You may notice that your downloaded workspace file is larger than what is
      mentioned here. This is because your projects are compressed before being
      stored on this webpage, but are plaintext JSON when downloaded.
    </p>
  </ContentArea>
  <ContentArea>
    <SectionHeader title="Website troubles" />
    <p>
      Incorrect/missing docs? Broken link? Error 404? Formatting/accessibility
      issues? Typo?
    </p>
    <p>
      Please let me know about any issues with the website, no matter how big or
      small, either
      <a href={discordLink} target="_blank">on Discord</a> or by
      <a
        href="https://github.com/sims4toolkit/sims4toolkit.github.io/issues"
        target="_blank">opening an issue</a
      >.
    </p>
  </ContentArea>
  <ContentArea banded={true}>
    <SectionHeader title="Package no worky" />
    <p>
      Found a bug in one of the S4TK packages? Open an issue in its GitHub
      repository. To find the bug tracker for a specific package, click the "Bug
      Tracker" link on its <a href="/docs" use:link>documentation page</a>.
    </p>
    <p>
      Please search the existing issues before posting to make sure you are not
      creating a duplicate.
    </p>
  </ContentArea>
  <ContentArea>
    <SectionHeader title="Learning the library" />
    <p>
      This website should cover everything you need to get started using the
      Sims 4 Toolkit library, but if you're stuck on something, I'm happy to
      help. Reach out to me
      <a href={discordLink} target="_blank">on Discord</a>.
    </p>
    <!-- <p>
      If you're completely stuck on how to begin using S4TK, please refer to
      <a href="https://patreon.frankkmods.com" target="_blank"
        >this post on Patreon</a
      >
      for a basic introduction to creating a Node.js project and running JS/TS code.
    </p> -->
    <p>
      Please note that I will NOT be offering any further help with Node.js,
      npm, JavaScript, or TypeScript. There are so, so, so many resources
      available to learn them online. Please restrict your questions to those
      pertaining to S4TK specifically.
    </p>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
