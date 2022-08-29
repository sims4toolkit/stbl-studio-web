<script lang="ts">
  import { onDestroy } from "svelte";
  import type { StringTableLocale } from "@s4tk/models/enums";
  import type Project from "src/lib/models/project";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import WindowManager from "src/lib/services/windows";
  import TranslateViewCell from "./TranslateViewCell.svelte";
  import Settings, {
    SettingsSubscriptionManager,
  } from "src/lib/services/settings";

  export let project: Project;
  export let locale: StringTableLocale;
  export let sliceToRender: LocalizedStringEntry[];

  let hideKey = Settings.translateHideKeys;

  const subscriptions = [
    SettingsSubscriptionManager.subscribe("translateHideKeys", (value) => {
      hideKey = value;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: translationPossible =
    project.stbl.numLocales > 1 && project.stbl.numEntries > 0;
</script>

{#if translationPossible && sliceToRender.length > 0}
  {#each sliceToRender as entry (entry.id)}
    <TranslateViewCell bind:project bind:locale bind:entry bind:hideKey />
  {/each}
{:else}
  <div
    class="w-full text-center py-12 px-4 border-2 border-dashed border-gray-400 dark:border-gray-600 hacker-border-gray"
  >
    {#if project.stbl.numEntries === 0}
      <h2 class="text-xl mb-4 text-subtle font-bold">This Project is Empty</h2>
      <p class="text-subtle mb-2">
        Add strings with the toolbar in the bottom-right corner.
      </p>
      <p class="text-subtle">
        Confused? Check out the <button
          class="text-secondary underline hover:no-underline"
          on:click={() => WindowManager.request("help")}>help menu</button
        >.
      </p>
    {:else if sliceToRender.length === 0}
      <h2 class="text-xl mb-4 text-subtle font-bold">Nothing to See Here</h2>
      <p class="text-subtle">
        No strings in this project match your search query.
      </p>
    {:else}
      <h2 class="text-xl mb-4 text-subtle font-bold">
        No Languages to Translate
      </h2>
      <p class="text-subtle">
        You can only translate to languages that are included in your project.
        Click the banner at the top of the page to add locales.
      </p>
    {/if}
  </div>
{/if}
