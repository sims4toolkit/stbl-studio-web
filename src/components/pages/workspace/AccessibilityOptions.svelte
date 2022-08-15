<script lang="ts">
  import { Settings } from "../../../typescript/storage";
  import {
    disableBlurStore,
    reduceMotionStore,
  } from "../../../typescript/stores";
  import Checkbox from "../../elements/Checkbox.svelte";

  export let matchInputHeight = false;

  let disableBlur = Settings.disableBlur;
  $: {
    disableBlur;
    disableBlurStore.set(disableBlur);
  }

  let reduceMotion = Settings.reduceMotion;
  $: {
    reduceMotion;
    reduceMotionStore.set(reduceMotion);
  }
</script>

<div>
  <p class="small-title my-0">Accessibility Options</p>
  <div
    class="flex-center-v flex-gap mt-half"
    class:input-height={matchInputHeight}
  >
    <Checkbox label="Disable Blur Effect" bind:checked={disableBlur} />
    <Checkbox label="Reduce Animations" bind:checked={reduceMotion} />
  </div>
</div>

<style lang="scss">
  // intentionally blank
</style>
