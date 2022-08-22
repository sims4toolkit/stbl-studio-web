<script lang="ts">
  import type Project from "src/lib/models/project";

  export let project: Project;

  let jsonContent = JSON.stringify(
    project.stbl.getJson<string>(undefined, true),
    null,
    2
  );
</script>

<div class="w-full flex flex-col gap-4">
  <div class="w-full flex justify-between">
    <p class="text-xs">
      <span class="font-bold text-red-600 dark:text-red-400">WARNING:</span>
      Do not edit in JSON mode unless you know what you are doing.
    </p>
  </div>
  <textarea
    class="w-full resize-none h-80 p-2 rounded monospace text-sm border bg-gray-50 border-gray-400 dark:bg-gray-700 dark:border-gray-900 hacker-border-gray placeholder:text-gray-400 dark:placeholder:text-gray-500"
    placeholder="Enter JSON content"
    bind:value={jsonContent}
  />
</div>
