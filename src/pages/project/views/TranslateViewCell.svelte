<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import ResizableTextArea from "src/components/elements/ResizableTextArea.svelte";
  const { formatStringKey } = window.S4TK.formatting;

  export let project: Project;
  export let locale: StringTableLocale;
  export let entry: LocalizedStringEntry;

  const keyValue = formatStringKey(entry.key);
  const sourceValue = project.stbl.getValue(entry.id);
  let translatedValue: string;

  $: {
    project;
    locale;
    updateTranslatedValue();
  }

  function updateTranslatedValue() {
    translatedValue = project.stbl.getValue(entry.id, locale) ?? "";
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
  <div class="flex justify-between items-start gap-4">
    <p class="pt-2 text-primary monospace text-sm">{keyValue}</p>
    <p class="py-2 flex-1 w-full">{sourceValue}</p>
    <div class="flex-1 w-full flex items-center">
      <ResizableTextArea
        bind:value={translatedValue}
        placeholder="Empty string"
        fillWidth={true}
        onBlur={saveString}
      />
    </div>
  </div>
</div>
