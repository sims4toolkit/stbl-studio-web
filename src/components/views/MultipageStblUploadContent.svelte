<script lang="ts">
  import { fade } from "svelte/transition";
  import Settings from "src/lib/services/settings";
  import type { MultipageContentState } from "src/components/layouts/types";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";
  import FileInput from "src/components/elements/FileInput.svelte";

  export let startingPageNumber = 1;
  export let multipageState: MultipageContentState;
  export let firstPageValid: boolean;

  let files: FileList;

  $: {
    if (files) {
      firstPageValid = true; // TODO: validate files
    }
  }
</script>

<MultipageContent pageNumber={startingPageNumber} bind:state={multipageState}>
  <div class="w-full flex flex-col gap-6">
    <p>
      Upload the string table(s) you'd like to include in this project. They can
      be binary, JSON, or in packages. Feel free to upload all of the packages
      for your mod, unneeded files will be ignored.
    </p>
    <FileInput
      accept=".package,.stbl,.binary,.json"
      label="upload files"
      bind:files
      multiple={true}
      errorMessage="Test"
    />
    <div>
      <p class="text-xs text-subtle mb-2">
        If there are multiple tables for the same language, they will be merged.
        The best way to ensure that multiple languages are handled properly is
        by uploading them in packages.
      </p>
      <p class="text-xs text-subtle">
        Using JSON? Read about the expected structure <span
          class="underline text-accent-secondary-light dark:text-accent-secondary-dark"
          >here</span
        >.
      </p>
    </div>
  </div>
</MultipageContent>
<MultipageContent
  pageNumber={startingPageNumber + 1}
  bind:state={multipageState}
>
  <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }} class="w-full">
    <!-- TODO: implement -->
    <p>File summary</p>
  </div>
</MultipageContent>
