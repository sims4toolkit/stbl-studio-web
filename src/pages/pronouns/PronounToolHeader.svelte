<script lang="ts">
  import { fade } from "svelte/transition";

  let showInstructions = false;
</script>

<div
  class="flex justify-center pt-16 pb-8 bg-gray-50 dark:bg-gray-700 bottom-shadow hacker-bg-black hacker-border-b-gray"
>
  <div class="w-full xl:max-w-screen-xl px-4">
    <div class="flex flex-col sm:flex-row justify-between">
      <h2 class="font-bold text-2xl text-gradient drop-shadow">
        Pronoun Batch Fix Tool
      </h2>
      <button
        class="default-button mt-4 sm:mt-0 text-sm flex items-center justify-center gap-2 rounded py-1 px-2 border border-black dark:border-white w-32"
        on:click={() => (showInstructions = !showInstructions)}
      >
        <img
          class="h-4"
          src="./assets/{showInstructions ? 'x' : 'help-circle-outline'}.svg"
          alt={showInstructions ? "X" : "?"}
        />
        {showInstructions ? "Hide" : "Information"}
      </button>
    </div>
    {#if showInstructions}
      <div in:fade>
        <div class="mt-4">
          <p class="text-subtle text-sm uppercase font-bold">The Problem</p>
          <p>
            The pronoun update is here, and there are new tokens to use instead
            of M/F. Most M/F tokens still work, as the game automatically
            replaces them at runtime. However, there are some issues. For
            example, it doesn't always know what to do with <code
              class="text-secondary">{"{F#.her}"}</code
            >
            and
            <code class="text-secondary">{"{M#.his}"}</code>, since they each
            have two meanings.
          </p>
        </div>
        <div class="my-4">
          <p class="text-subtle text-sm uppercase font-bold">The Solution</p>
          <ol class="list-disc pl-4">
            <li class="mb-2">
              Select which M/F pronouns you want to convert to gender-neutral
              tokens.
            </li>
            <li class="mb-2">
              Upload your strings to this website, either in string table
              binaries or packages.
            </li>
            <li>
              When the batch fix is done, you can review the changes that were
              made and download your updated string tables.
            </li>
          </ol>
        </div>
      </div>
    {/if}
    <p class="text-subtle text-xs mt-4">
      Note that this tool only works for English, and will <strong
        class="text-subtle underline">not</strong
      > correct verb conjugation (i.e. "they is" &rarr; "they are"), as there is
      currently no way to do so.
    </p>
  </div>
</div>
