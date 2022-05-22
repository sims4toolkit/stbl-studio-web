<script lang="ts">
  import { fly } from "svelte/transition";
  import type Project from "../../../typescript/models/project";
  import FileInput from "../../elements/FileInput.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";
  import ProgressCircles from "../../elements/ProgressCircles.svelte";

  export let onComplete: (project?: Project) => void;

  const animationDuration = 1000;

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
  </div>
  <div in:fly={{ y: 15, duration: animationDuration }}>
    <p class="my-2">
      Upload string tables that belong to the same project (i.e. they have the
      same instance base, but different locales). String table binaries, JSONs
      containing key/value pairs*, and packages containing string tables are all
      accepted.
    </p>
    <FileInput
      label="upload string tables"
      bind:files={uploadedFiles}
      accept=".json,.bnry,.stbl,.binary,.package"
      multiple={true}
      bind:filesInvalid
    />
    <p class="mb-0 mt-2 subtle-text">
      * JSON must be a list of objects that have &quot;key&quot; and
      &quot;value&quot; properties. The key must be a number or a string
      containing a hex number (with or without &quot;0x&quot;). The value must
      be a string.
    </p>
  </div>
  <div
    class="flex-space-between mt-2"
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
