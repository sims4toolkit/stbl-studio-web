<script lang="ts">
  import { fly } from "svelte/transition";
  import type { StringTableResource } from "@s4tk/models";
  import type { StringEntry } from "@s4tk/models/types";
  import ResizableTextArea from "../../elements/ResizableTextArea.svelte";
  import SplitView from "../../layout/SplitView.svelte";
  import { Settings } from "../../../typescript/storage";
  import type Project from "../../../typescript/models/project";

  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let showKeys: boolean;
  export let entry: StringEntry;
  export let otherStbl: StringTableResource;

  let translatedValue =
    otherStbl.getByKey(entry.key)?.value.replaceAll("\\n", "\n") ?? "";

  function handleTranslateBlur() {
    const value = translatedValue.replaceAll("\n", "\\n");

    if (value === entry.value) {
      otherStbl.deleteByKey(entry.key);
    } else {
      const otherEntry = otherStbl.getByKey(entry.key);

      if (otherEntry) {
        otherEntry.value = value;
      } else {
        otherStbl.add(entry.key, value);
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
      class="monospace accent-color mt-0 mb-half key-string"
    >
      {formatStringKey(entry.key)}
    </p>
  {/if}
  <SplitView fillWidth={true} centerV={false} useGap={true}>
    <div slot="left" class="w-100">
      <p class="source-string w-100 pre-wrap">
        {entry.value.replaceAll("\\n", "\n")}
      </p>
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
  .translate-entry {
    background-color: var(--color-bg-secondary) !important;

    p.key-string {
      padding-left: 8px;
    }

    p.source-string {
      margin: 0;
      padding: 8px;
      font-size: 1em;
    }
  }
</style>
