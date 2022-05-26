<script lang="ts">
  import { fade } from "svelte/transition";
  import Workspace from "../../typescript/models/workspace";
  import { Settings } from "../../typescript/storage";
  import { activeWorkspace, defaultLocaleStore } from "../../typescript/stores";
  import GradientHeader from "../elements/GradientHeader.svelte";
  import IconTextButton from "../elements/IconTextButton.svelte";
  import AccessibilityOptions from "../elements/AccessibilityOptions.svelte";
  import LocaleSelect from "../elements/LocaleSelect.svelte";
  import MultipageModalContent from "../layout/MultipageModalContent.svelte";
  import UploadWorkspaceView from "./UploadWorkspaceView.svelte";

  export let exitOnboarding: () => void;

  let currentPage = 1;
  let defaultLocale = Settings.defaultLocale;
  let uploadingWorkspace = false;

  $: {
    defaultLocale;
    defaultLocaleStore.set(defaultLocale);
  }

  function nextButtonClicked() {
    if (currentPage === 1) {
      currentPage++;
    } else if (currentPage === 2) {
      Settings.hasWorkspace = true;
      activeWorkspace.set(new Workspace());
      exitOnboarding();
    }
  }
</script>

{#if uploadingWorkspace}
  <UploadWorkspaceView onSuccessfulUpload={exitOnboarding} />
{:else}
  <MultipageModalContent
    numPages={2}
    completePages={currentPage}
    bind:currentPage
    minimumContentHeight="160"
    finalPageNextButtonText="Get Started"
    onNextButtonClick={nextButtonClicked}
  >
    <div slot="header">
      <p class="mt-0 mb-half">Welcome to</p>
      <GradientHeader title="String Table Studio" />
      <p class="subtle-text mt-1 mb-0">
        Powered by <a href="https://sims4toolkit.com" target="_blank"
          >Sims 4 Toolkit</a
        >
      </p>
    </div>
    <div slot="content">
      {#if currentPage === 1}
        <p class="mt-0">
          String Table Studio is a web app that makes it easy to create, edit,
          and translate string tables for Sims 4 mods. View the <a
            href="https://github.com/sims4toolkit/stbl-studio-web/README.md"
            target="_blank">feature list</a
          > to learn more about what it can do.
        </p>
        <div class="mt-2">
          <div class="flex-wrap flex-gap-large">
            <LocaleSelect
              label="Default Locale"
              name="default-locale-select"
              bind:selectedLocale={defaultLocale}
            />
            <AccessibilityOptions matchInputHeight={true} />
          </div>
        </div>
      {:else}
        <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}>
          <p class="my-0">Thanks! Before proceeding, please keep in mind:</p>
          <ul>
            <li class="mb-half">
              All data that you create or upload on this website is stored
              locally on your computer, not on the internet. If you clear your
              browser's storage, you will lose your data.
            </li>
            <li class="mb-half">
              You can download your data at any time, and use it to backup,
              restore, or move your entire workspace to another browser or
              device.
            </li>
            <li class="mb-half">
              Your data is your responsibility. I am not at fault for any
              losses.
            </li>
          </ul>
        </div>
      {/if}
    </div>
  </MultipageModalContent>
{/if}

<div class="upload-workspace-button flex-center-h">
  <IconTextButton
    icon={uploadingWorkspace ? "x" : "upload"}
    text={uploadingWorkspace ? "Stop Uploading" : "Upload Workspace"}
    onClick={() => (uploadingWorkspace = !uploadingWorkspace)}
  />
</div>

<style lang="scss">
  .upload-workspace-button {
    font-size: 0.8em;
    position: fixed;
    bottom: 32px;
    left: 0;
    right: 0;
  }
</style>
