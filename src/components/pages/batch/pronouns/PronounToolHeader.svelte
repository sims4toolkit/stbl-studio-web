<script lang="ts">
  import GradientHeader from "../../../elements/GradientHeader.svelte";
</script>

<GradientHeader title="Pronoun Batch Fix" />
<div class="mt-2">
  <p class="small-title mt-0">The Problem</p>
  <p>
    The pronoun update is here, and there are new tokens to use instead of M/F.
    Most M/F tokens still work, as the game automatically replaces them at
    runtime. However, there are some issues. For example, it doesn't always know
    what to do with <code>{"{F#.her}"}</code> and <code>{"{M#.his}"}</code>,
    since they each have two meanings.
  </p>
</div>
<div class="my-2">
  <p class="small-title mt-0 mb-1">The Solution</p>
  <ol>
    <li class="mb-half">
      Select which M/F pronouns you want to convert to gender-neutral tokens.
    </li>
    <li class="mb-half">
      Upload your strings to this website, either in string table binaries or
      packages.
    </li>
    <li class="mb-half">
      All English string tables will be extracted from your uploaded files, and
      their strings will be replaced as needed.
    </li>
    <li>
      When the batch fix is done, you can review the changes that were made and
      download your updated string tables.
    </li>
  </ol>
</div>
<p class="subtle-text my-0">
  Note that this tool will <strong>not</strong> correct verb conjugation (i.e. "they
  is" &rarr; "they are"), as there is currently no way to do so.
</p>

<style lang="scss">
  // intentionally blank
</style>
