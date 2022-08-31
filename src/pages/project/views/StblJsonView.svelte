<script lang="ts">
  import type Project from "src/lib/models/project";
  import WindowManager from "src/lib/services/windows";
  import { normalizeJson } from "src/lib/utilities/json";

  export let project: Project;
  export const saveJson = () => {
    try {
      const json = normalizeJson(jsonContent);
      project.replaceEntries(json);
      project = project;
      return true;
    } catch (err) {
      console.error(err);

      alert(
        "Your JSON appears to be malformed and could not be saved. Check the console for error details."
      );

      return false;
    }
  };

  let jsonContent = JSON.stringify(
    project.stbl.getJson<string>(undefined, true),
    null,
    2
  );
</script>

<div class="w-full flex flex-col gap-4">
  <div class="w-full flex flex-col gap-2">
    <p class="text-xs text-subtle">
      <span class="font-bold text-red-600 dark:text-red-400">WARNING:</span>
      Do not edit in JSON mode unless you know what you are doing. (1) You will not
      be asked to confirm if you want to delete strings, and there is no way to recover
      them if you do. (2) Changing an entry's key will delete ALL of its translations.
      (3) This mode does not autosave; you must click the "Save" button manually.
    </p>
    <p class="text-xs text-subtle">
      Confused about the syntax? Read about it <button
        class="text-secondary underline hover:no-underline"
        on:click={() => {
          WindowManager.request("help", "open", { route: "/json" });
        }}>here</button
      >.
    </p>
  </div>
  <textarea
    class="w-full resize-none h-80 p-2 rounded monospace text-sm border bg-gray-50 border-gray-400 dark:bg-gray-700 dark:border-gray-900 hacker-border-gray placeholder:text-gray-400 dark:placeholder:text-gray-500"
    placeholder="Enter JSON content"
    bind:value={jsonContent}
  />
</div>
