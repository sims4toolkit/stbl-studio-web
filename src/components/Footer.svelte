<script lang="ts">
  import ContentArea from "./shared/ContentArea.svelte";
  import SplitView from "./shared/SplitView.svelte";
</script>

<section id="footer" class="flex-center text-center">
  <ContentArea>
    <SplitView useGap={false}>
      <p slot="left" class="bottom-margin">
        Created with <span class="heart">&#9829;</span> by Frankk
      </p>
      <p slot="right">
        <a href="https://frankkmods.com" target="_blank" class="frankk-color"
          >Website</a
        >
        |
        <a
          href="https://twitter.com/frankkulakmods"
          target="_blank"
          class="twitter-color">Twitter</a
        >
        |
        <a
          href="https://patreon.frankkmods.com"
          target="_blank"
          class="patreon-color">Patreon</a
        >
        |
        <a
          href="https://ko-fi.com/frankkulak"
          target="_blank"
          class="kofi-color">Ko-fi</a
        >
        |
        <a
          href="https://discord.gg/qNhD3Jh"
          target="_blank"
          class="discord-color">Discord</a
        >
      </p>
    </SplitView>
    <br />
    <SplitView useGap={false}>
      <p slot="left" class="bottom-margin">Powered by Sims 4 Toolkit</p>
      <p slot="right">
        <a href="https://sims4toolkit.com" target="_blank" class="s4tk-color"
          >Website</a
        >
        |
        <a
          href="https://twitter.com/simstoolkit"
          target="_blank"
          class="twitter-color">Twitter</a
        >
        |
        <a
          href="https://github.com/sims4toolkit"
          target="_blank"
          class="github-color">GitHub</a
        >
        |
        <a href="https://npmjs.org/org/s4tk" target="_blank" class="npm-color"
          >npm</a
        >
      </p>
    </SplitView>
    <hr />
    <p class="disclaimer">
      The Sims™ and its plumbob icon are registered trademarks of Electronic
      Arts, Inc. (EA). Sims 4 Toolkit is not affiliated with or endorsed by EA.
    </p>
    <p class="disclaimer">
      All icons on this website are supplied by
      <a href="https://ionic.io/ionicons" target="_blank">Ionicons</a> and
      <a href="https://primer.github.io/octicons/" target="_blank"
        >GitHub Octicons</a
      >.
    </p>
    <p class="disclaimer">2022 © Frank Kulak</p>
  </ContentArea>
</section>

<style lang="scss">
  section#footer {
    background-color: var(--color-footer);
    color: var(--color-light);
    width: 100%;
    flex-direction: column;

    .heart {
      color: rgb(218, 76, 135);
    }

    p {
      margin: 0;

      &.disclaimer,
      &.bottom-margin {
        margin-bottom: 0.65em;
      }
    }

    hr {
      width: 100%;
      background-color: var(--color-light);
      opacity: 0.5;
      border: none;
      height: 1px;
      margin: 3em 0;
    }

    a {
      white-space: nowrap;
    }
  }
</style>
