<script lang="ts">
  import type Project from "src/lib/models/project";
  import { getLocaleData } from "src/lib/utilities/localization";

  export let project: Project;
</script>

<div class="flex gap-2">
  <div
    class="flex flex-col flex-1 items-center justify-center py-1 px-4 gap-1 rounded border border-gray-300 dark:border-gray-600"
  >
    <p class="text-subtle font-bold text-xs">SOURCE</p>
    <p class="text-sm">{getLocaleData(project.metaData.primaryLocale).code}</p>
  </div>
  <div
    class="flex flex-col flex-1 items-center justify-center py-1 px-4 gap-1 rounded border border-gray-300 dark:border-gray-600"
  >
    <p class="text-subtle font-bold text-xs">LOCALES</p>
    <p class="text-sm">{project.metaData.numLocales}</p>
  </div>
  <div
    class="flex flex-col flex-1 items-center justify-center py-1 px-4 gap-1 rounded border border-gray-300 dark:border-gray-600"
  >
    <p class="text-subtle font-bold text-xs">STRINGS</p>
    <p class="text-sm">{project.metaData.numEntries}</p>
  </div>
</div>
