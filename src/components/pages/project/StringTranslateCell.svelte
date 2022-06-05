<script lang="ts">
  import { fly } from "svelte/transition";
  import type { StringTableResource } from "@s4tk/models";
  import type { StringEntry } from "@s4tk/models/types";
  import ResizableTextArea from "../../shared/elements/ResizableTextArea.svelte";
  import SplitView from "../../shared/layout/SplitView.svelte";
  import { Settings } from "../../../typescript/storage";
  import type Project from "../../../typescript/models/project";

  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let showKeys: boolean;
  export let entry: StringEntry;
  export let otherStbl: StringTableResource;

  let translatedValue: string = otherStbl.getByKey(entry.key)?.value ?? "";

  function handleTranslateBlur() {
    if (translatedValue === entry.value) {
      otherStbl.deleteByKey(entry.key);
    } else {
      const otherEntry = otherStbl.getByKey(entry.key);

      if (otherEntry) {
        otherEntry.value = translatedValue;
      } else {
        otherStbl.add(entry.key, translatedValue);
      }
    }

    project.saveStblMap();
    project = project;
  }
</script>

<div class="translate-entry floating-card drop-shadow">
  {#if showKeys}
    <p
      transition:fly={{ y: 10, duration: Settings.reduceMotion ? 0 : 200 }}
      class="monospace accent-color my-0"
    >
      {formatStringKey(entry.key)}
    </p>
  {/if}
  <SplitView fillWidth={true}>
    <div slot="left" class="w-100">
      <p class="my-0 w-100">{entry.value}</p>
    </div>
    <div slot="right" class="w-100">
      <ResizableTextArea
        bind:value={translatedValue}
        placeholder="Untranslated"
        fillWidth={true}
        onBlur={handleTranslateBlur}
      />
    </div>
  </SplitView>
</div>

<style lang="scss">
  // intentionally blank
</style>
