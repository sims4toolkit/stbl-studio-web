<script lang="ts">
  import { fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type Project from "../../../typescript/models/project";
  import FileInput from "../../elements/FileInput.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";
  import ProgressCircles from "../../elements/ProgressCircles.svelte";

  export let onComplete: (project?: Project) => void;

  const animationDuration = 1000;

  const uuid: string = uuidv4();
  let uploadedFiles: FileList;
  let filesInvalid = false;
  let circlesFilled = 0;

  $: {
    if (uploadedFiles?.length) {
      // TODO:
      onComplete();
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
      Upload string tables to include in this project. A single string table can
      be uploaded as binary or JSON, but multiple string tables must be uploaded
      in a package or JSON.
    </p>
    <FileInput
      label="binary, json, or package only"
      bind:files={uploadedFiles}
      accept=".json,.stbl,.bnry,.binary,.package"
      bind:filesInvalid
    />
    <p class="my-2 subtle-text">
      Using JSON? Read about the expected syntax <a
        class="text-color"
        href="#/help?title=json"
        target="_blank">here</a
      >.
    </p>
  </div>
  <div
    class="flex-space-between"
    in:fly={{ y: 25, duration: animationDuration }}
  >
    <ProgressCircles circles={2} filled={circlesFilled} />
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
