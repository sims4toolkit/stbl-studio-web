<script lang="ts">
  import NavigationButton from "../shared/NavigationButton.svelte";
  import ProgressCircles from "../shared/ProgressCircles.svelte";

  let creatorName: string = "";

  $: nameFilledIn = Boolean(creatorName);

  function nextButtonClicked() {
    // TODO:
    alert("next");
  }
</script>

<div class="onboarding-view">
  <div class="mb-2">
    <p class="my-0">Welcome to</p>
    <h2>
      <span class="default-gradient-text text-shadow">String Table Studio</span>
    </h2>
    <p class="subtle-text my-0">
      Powered by <a href="https://sims4toolkit.com" target="_blank"
        >Sims 4 Toolkit</a
      >
    </p>
  </div>
  <div class="mb-2">
    <p>
      String Table Studio is a web app that makes it easy to create, edit, and
      translate string tables for Sims 4 mods. View the <a
        href="https://github.com/sims4toolkit/stbl-studio-web/README.md"
        target="_blank">feature list</a
      > to learn more about what it can do.
    </p>
    <p class="mb-2">
      Please provide your creator name to help keep your hashes unique.
    </p>
    <input
      class="w-100"
      type="text"
      placeholder="Creator Name..."
      bind:value={creatorName}
    />
  </div>
  <div class="flex-space-between">
    <ProgressCircles circles={2} filled={nameFilledIn ? 1 : 0} />
    <NavigationButton
      text="Next"
      direction="right"
      bind:active={nameFilledIn}
      onClick={nextButtonClicked}
    />
  </div>
</div>

<style lang="scss">
  .onboarding-view {
    h2 {
      margin-top: 0.2em;
      margin-bottom: 0.6em;
    }

    .subtle-text {
      font-size: 0.8em;
      opacity: 0.65;
    }

    a {
      color: var(--color-text);
    }
  }
</style>
