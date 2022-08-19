<script lang="ts">
  import type Project from "src/lib/models/project";

  export let project: Project;

  let jsonContent = JSON.stringify(
    project.stbl.getJson<string>(undefined, true),
    null,
    2
  );
</script>

<textarea
  class="w-full rounded monospace text-sm border bg-gray-50 border-gray-400 dark:bg-gray-700 dark:border-gray-900"
  bind:value={jsonContent}
/>
