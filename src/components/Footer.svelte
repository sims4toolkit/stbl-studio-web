<script lang="ts">
  import ContentArea from "./layout/ContentArea.svelte";
</script>

<div id="footer" class="flex-center text-center">
  <ContentArea>
    <div class="mb-3">
      <p>
        Created with <span class="heart">&#9829;</span> by Frankk using Sims 4 Toolkit
      </p>
      <p>
        <a href="https://frankkmods.com" target="_blank" class="frankk-color"
          >Frankk's Mods</a
        >
        |
        <a href="https://sims4toolkit.com" target="_blank" class="s4tk-color"
          >Sims 4 Toolkit</a
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
    </div>
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
</div>

<style lang="scss">
  #footer {
    background-color: var(--color-footer);
    color: var(--color-text);
    width: 100%;
    flex-direction: column;

    .heart {
      color: rgb(218, 76, 135);
    }

    a {
      white-space: nowrap;
    }
  }
</style>
