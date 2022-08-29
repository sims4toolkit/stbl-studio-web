<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import ResizableTextArea from "src/components/elements/ResizableTextArea.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let locale: StringTableLocale;
  export let entry: LocalizedStringEntry;
  export let hideKey: boolean;

  const keyValue = formatStringKey(entry.key);
  const sourceValue =
    project.stbl.getValue(entry.id)?.replace(/\\n/g, "\n") ?? "";
  let translatedValue: string;

  $: {
    project;
    locale;
    updateTranslatedValue();
  }

  function updateTranslatedValue() {
    translatedValue =
      project.stbl.getValue(entry.id, locale)?.replace(/\\n/g, "\n") ?? "";
  }

  function saveString() {
    if (translatedValue !== project.stbl.getValue(entry.id, locale)) {
      project.setValue(entry.id, translatedValue, locale);
      project = project;
    }
  }
</script>

<div
  class="w-full flex-0 flex flex-col gap-2 py-2 px-4 first:rounded-t last:rounded-b bg-gray-50 dark:bg-gray-700 hacker-bg-black border border-gray-100 dark:border-gray-800 hacker-border-gray"
>
  <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
    <p class="pt-2 text-primary monospace" hidden={hideKey}>
      {keyValue}
    </p>
    <p
      class="py-2 flex-1 w-full whitespace-pre-wrap"
      class:text-gray-400={!Boolean(sourceValue)}
      class:dark:text-gray-500={!Boolean(sourceValue)}
    >
      {sourceValue ? sourceValue : "Empty string"}
    </p>
    <div class="flex-1 w-full flex items-center mb-2 sm:mb-0">
      <ResizableTextArea
        bind:value={translatedValue}
        placeholder="Same as source language"
        fillWidth={true}
        onBlur={saveString}
      />
    </div>
  </div>
</div>
