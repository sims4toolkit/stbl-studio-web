<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import FileInput from "../../shared/elements/FileInput.svelte";
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import NavigationButton from "../../shared/elements/NavigationButton.svelte";
  import ProgressCircles from "../../shared/controls/ProgressCircles.svelte";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import { Settings } from "../../../typescript/storage";
  import { subscribeToKey } from "../../../typescript/keybindings";

  export let onComplete: () => void;

  const animationDuration = Settings.reduceMotion ? 0 : 1000;

  const uuid = uuidv4();

  let uploadedFiles: FileList;
  let filesInvalid = false;
  let circlesFilled = 0;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  $: {
    if (uploadedFiles?.length) {
      // TODO: read files
    }
  }

  function nextClicked() {
    // TODO:
  }
</script>

<div>
  <div in:fly={{ y: -15, duration: animationDuration }}>
    <GradientHeader title="Upload Project" />
    <p class="mt-1 subtle-text">UUID: {uuid}</p>
  </div>
  <div in:fly={{ y: 15, duration: animationDuration }}>
    <p class="my-2">
      Upload the string table(s) you'd like to include in this project. They can
      be binary, JSON, or in packages. Feel free to upload all of the packages
      for your mod, unneeded files will be ignored.
    </p>
    <FileInput
      label="binaries, jsons, and/or packages only"
      bind:files={uploadedFiles}
      accept=".json,.stbl,.bnry,.binary,.package"
      multiple={true}
      bind:filesInvalid
    />
    <div class="my-2">
      <p class="subtle-text mt-0">
        If there are multiple tables with the same locale, they will be merged.
      </p>
      <p class="subtle-text mb-0">
        Using JSON? Read about the expected structure <a
          href="#/help?title=json"
          target="_blank">here</a
        >.
      </p>
    </div>
  </div>
  <div
    class="flex-space-between"
    in:fly={{ y: 25, duration: animationDuration }}
  >
    <ProgressCircles circles={2} currentPage={1} filled={circlesFilled} />
    <NavigationButton
      text="Next"
      direction="right"
      onClick={nextClicked}
      active={true}
    />
  </div>
</div>

<style lang="scss">
  // intentionally blank
</style>
