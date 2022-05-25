<script lang="ts">
  import { Settings } from "../../typescript/storage";
  import { disableBlurStore, reduceMotionStore } from "../../typescript/stores";
  import Checkbox from "../elements/Checkbox.svelte";

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

<p class="small-title mt-2">Accessibility Options</p>
<div class="flex-center-v flex-gap">
  <Checkbox label="Disable Blur Effect" bind:checked={disableBlur} />
  <Checkbox label="Reduce Motion" bind:checked={reduceMotion} />
</div>

<style lang="scss">
  // intentionally blank
</style>
