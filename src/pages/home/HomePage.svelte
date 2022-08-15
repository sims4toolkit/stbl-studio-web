<script lang="ts">
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import type Workspace from "src/lib/models/workspace";

  let workspace: Workspace;
  let showWorkspace = true;
</script>

<div class="w-100 flex justify-center" class:flex-1={!showWorkspace}>
  {#if showWorkspace}
    <div class="w-full xl:max-w-screen-xl px-4 py-12">
      <p>Has workspace</p>
    </div>
  {:else}
    <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
      <div class="mb-8">
        <SectionHeader title="Your workspace is empty" />
      </div>
      <p class="mb-4">
        Create a new project with the toolbar in the bottom-right corner.
      </p>
      <p>Need help? Check out the help page for more information.</p>
    </div>
  {/if}
</div>
