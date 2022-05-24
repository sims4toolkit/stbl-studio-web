<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import Workspace from "../../typescript/models/workspace";
  import { Settings } from "../../typescript/storage";
  import { activeWorkspace } from "../../typescript/stores";
  import NavigationButton from "../elements/NavigationButton.svelte";
  import ProgressCircles from "../elements/ProgressCircles.svelte";
  import FileInput from "../elements/FileInput.svelte";
  import GradientHeader from "../elements/GradientHeader.svelte";
  import IconTextButton from "../elements/IconTextButton.svelte";

  export let exitOnboarding: () => void;

  const animationDuration = 1000;
  let page: "name" | "disclaimers" | "upload" = "name";
  let creatorName: string = "";
  $: nameFilledIn = Boolean(creatorName);
  $: filledInCircles =
    (nameFilledIn ? 1 : 0) + (page === "disclaimers" ? 1 : 0);

  function nextButtonClicked() {
    if (page === "name") {
      page = "disclaimers";
    } else if (page === "disclaimers") {
      Settings.creatorName = creatorName;
      Settings.hasWorkspace = true;
      activeWorkspace.set(new Workspace());
      exitOnboarding();
    }
  }

  function uploadWorkspaceButtonClicked() {
    page = page === "upload" ? "name" : "upload";
  }

  let uploadedFiles: FileList;
  let workspaceFileIsInvalid = false;

  $: {
    if (uploadedFiles?.length) {
      readWorkspaceFile();
    }
  }

  async function readWorkspaceFile() {
    try {
      workspaceFileIsInvalid = false;
      const file = uploadedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = window.S4TK.Node.Buffer.from(arrayBuffer);
      const json = JSON.parse(buffer.toString());
      const workspace = await Workspace.restoreFromJson(json);
      activeWorkspace.set(workspace);
      exitOnboarding();
    } catch (err) {
      console.error(err);
      workspaceFileIsInvalid = true;
    }
  }
</script>

<div class="onboarding-view">
  {#if page !== "upload"}
    <div class="mb-2" in:fly={{ y: -20, duration: animationDuration }}>
      <p class="my-0">Welcome to</p>
      <h2>
        <span class="default-gradient-text text-shadow"
          >String Table Studio</span
        >
      </h2>
      <p class="subtle-text my-0">
        Powered by <a href="https://sims4toolkit.com" target="_blank"
          >Sims 4 Toolkit</a
        >
      </p>
    </div>
    <div class="mb-2" in:fly={{ y: 20, duration: animationDuration }}>
      {#if page === "name"}
        <p>
          String Table Studio is a web app that makes it easy to create, edit,
          and translate string tables for Sims 4 mods. View the <a
            href="https://github.com/sims4toolkit/stbl-studio-web/README.md"
            target="_blank">feature list</a
          > to learn more about what it can do.
        </p>
        <p class="mb-2">Please provide your name to get started.</p>
        <input
          class="w-100"
          type="text"
          placeholder="Name..."
          bind:value={creatorName}
        />
      {:else}
        <div in:fade={{ duration: animationDuration }}>
          <p>Thanks, {creatorName}! Before proceeding, please keep in mind:</p>
          <ul>
            <li>
              All data that you create or upload on this website is stored
              locally on your computer, not on the internet. If you clear your
              browser's storage, you will lose your data.
            </li>
            <li>
              You can download your data at any time, and use it to backup,
              restore, or move your entire workspace to another browser or
              device.
            </li>
            <li>
              Your data is your responsibility. I am not at fault for any
              losses.
            </li>
          </ul>
        </div>
      {/if}
    </div>
    <div
      class="flex-space-between"
      in:fly={{ y: 35, duration: animationDuration }}
    >
      <ProgressCircles circles={2} filled={filledInCircles} />
      <NavigationButton
        text={page === "name" ? "Next" : "Get Started"}
        direction="right"
        bind:active={nameFilledIn}
        onClick={nextButtonClicked}
      />
    </div>
  {:else}
    <div in:fly={{ y: -15, duration: animationDuration }}>
      <GradientHeader title="Welcome back!" />
    </div>
    <div in:fly={{ y: 15, duration: animationDuration }}>
      <p class="my-2">
        Upload your workspace file to pick up where you left off.
      </p>
      <FileInput
        label="workspace json only"
        errorMessage="File is not a valid workspace"
        accept=".json"
        bind:files={uploadedFiles}
        bind:filesInvalid={workspaceFileIsInvalid}
      />
    </div>
  {/if}
  <div class="upload-workspace flex-center-h" in:fade>
    <IconTextButton
      icon={page === "upload" ? "x" : "upload"}
      text={page === "upload" ? "Stop Uploading" : "Upload Workspace"}
      onClick={uploadWorkspaceButtonClicked}
    />
  </div>
</div>

<style lang="scss">
  .onboarding-view {
    h2 {
      margin-top: 0.2em;
      margin-bottom: 0.6em;
    }

    .upload-workspace {
      font-size: 0.8em;
      position: fixed;
      bottom: 32px;
      left: 0;
      right: 0;
    }

    li {
      margin-bottom: 0.35em;
    }
  }
</style>
