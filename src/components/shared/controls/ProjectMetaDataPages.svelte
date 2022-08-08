<script lang="ts">
  import { fade } from "svelte/transition";
  import type { LocaleOption } from "../../../global";
  import { getLocaleData } from "../../../typescript/helpers/localization";
  import { Settings } from "../../../typescript/storage";
  import LocaleCheckboxesView from "../../pages/home/LocaleCheckboxesView.svelte";
  import GroupInstanceLocale from "./GroupInstanceLocale.svelte";
  import ProjectNameInput from "./ProjectNameInput.svelte";

  const { StringTableLocale } = window.S4TK.enums;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  export let uuid: string;
  export let defaultInstanceString: string = "the hash of the UUID";
  export let currentPage: number;
  export let isPage1Valid = false;
  export let name = "";
  export let primaryLocale = Settings.defaultLocale;
  export let otherLocaleOptions: LocaleOption[];
  export let groupHexString = "80000000";
  export let instanceHexString = formatAsHexString(
    StringTableLocale.getInstanceBase(fnv64(uuid)),
    14,
    false
  );

  let isNameValid = false;
  let isGroupValid = false;
  let isInstanceValid = false;

  $: {
    isPage1Valid = isNameValid && isGroupValid && isInstanceValid;
  }
</script>

{#if currentPage === 1}
  <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}>
    <form class="w-100 mb-2">
      <ProjectNameInput {uuid} bind:name bind:isNameValid />
      <div class="mt-1">
        <GroupInstanceLocale
          {uuid}
          bind:groupHexString
          bind:isGroupValid
          bind:instanceHexString
          bind:isInstanceValid
          bind:selectedLocale={primaryLocale}
        />
      </div>
    </form>
    <div>
      <p class="subtle-text mt-0 mb-half">
        The instance is {defaultInstanceString} by default, but it can be changed
        manually.
      </p>
      <p class="subtle-text my-0">
        The 2-digit locale code will automatically be prepended to the instance.
      </p>
    </div>
  </div>
{:else}
  <div in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}>
    <p class="mb-2">
      Select additional locales to include in this project. Strings added to
      your primary locale ({getLocaleData(primaryLocale).englishName}) will
      automatically be added to these ones as well.
    </p>
    <LocaleCheckboxesView bind:localeChoices={otherLocaleOptions} />
  </div>
{/if}

<style lang="scss">
  // intentionally blank
</style>
