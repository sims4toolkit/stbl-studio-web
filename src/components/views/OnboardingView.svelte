<script lang="ts">
  import NavigationButton from "../shared/NavigationButton.svelte";
  import ProgressCircles from "../shared/ProgressCircles.svelte";

  let page: "name" | "disclaimers" | "upload" = "name";

  let creatorName: string = "";

  $: nameFilledIn = Boolean(creatorName);

  $: filledInCircles =
    (nameFilledIn ? 1 : 0) + (page === "disclaimers" ? 1 : 0);

  function nextButtonClicked() {
    if (page === "name") {
      page = "disclaimers";
    } else if (page === "disclaimers") {
      // TODO:
    }
  }

  function uploadWorkspaceButtonClicked() {
    page = "upload";
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
    {#if page === "name"}
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
    {:else if page === "disclaimers"}
      <p>Thanks, {creatorName}! Before proceeding, please keep in mind:</p>
      <ul>
        <li>
          The data that this website uses is stored locally on your computer. If
          you clear your browser's cookies, you will lose your data.
        </li>
        <li>
          You can download your data at any time, and use it to backup, restore,
          or move your entire workspace to another browser or device.
        </li>
        <li>
          Your data is your responsibility. I am not at fault for any losses.
        </li>
      </ul>
    {/if}
  </div>
  <div class="flex-space-between">
    <ProgressCircles circles={2} filled={filledInCircles} />
    <NavigationButton
      text={page === "name" ? "Next" : "Get Started"}
      direction="right"
      bind:active={nameFilledIn}
      onClick={nextButtonClicked}
    />
  </div>
  {#if page !== "upload"}
    <div class="upload-workspace text-center">
      <span on:click={uploadWorkspaceButtonClicked}
        >I have a workspace to upload.</span
      >
    </div>
  {/if}
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

    .upload-workspace {
      font-size: 0.8em;
      position: fixed;
      bottom: 32px;
      left: 0;
      right: 0;

      span {
        text-decoration: underline;
      }

      span:hover {
        text-decoration: none;
        cursor: pointer;
      }
    }

    li {
      margin-bottom: 0.35em;
    }
  }
</style>
