<script lang="ts">
  import { fade } from "svelte/transition";
  import GradientHeader from "../../../elements/GradientHeader.svelte";
  import IconTextButton from "../../../elements/IconTextButton.svelte";
  import SplitView from "../../../layout/SplitView.svelte";

  let showInstructions = false;
</script>

<SplitView>
  <GradientHeader slot="left" title="Pronoun Batch Fix Tool" />
  <IconTextButton
    slot="right"
    icon={showInstructions ? "x" : "help-circle-outline"}
    text={showInstructions ? "Hide" : "Information"}
    onClick={() => (showInstructions = !showInstructions)}
  />
</SplitView>
{#if showInstructions}
  <div in:fade>
    <div class="mt-2">
      <p class="small-title mt-0">The Problem</p>
      <p>
        The pronoun update is here, and there are new tokens to use instead of
        M/F. Most M/F tokens still work, as the game automatically replaces them
        at runtime. However, there are some issues. For example, it doesn't
        always know what to do with <code>{"{F#.her}"}</code> and
        <code>{"{M#.his}"}</code>, since they each have two meanings.
      </p>
    </div>
    <div class="my-2">
      <p class="small-title mt-0 mb-1">The Solution</p>
      <ol>
        <li class="mb-half">
          Select which M/F pronouns you want to convert to gender-neutral
          tokens.
        </li>
        <li class="mb-half">
          Upload your strings to this website, either in string table binaries
          or packages.
        </li>
        <li>
          When the batch fix is done, you can review the changes that were made
          and download your updated string tables.
        </li>
      </ol>
    </div>
  </div>
{/if}
<p class="subtle-text mt-2 mb-0">
  Note that this tool only works for English, and will <strong>not</strong> correct
  verb conjugation (i.e. "they is" &rarr; "they are"), as there is currently no way
  to do so.
</p>

<style lang="scss">
  // intentionally blank
</style>
