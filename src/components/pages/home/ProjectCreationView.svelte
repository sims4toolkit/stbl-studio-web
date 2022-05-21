<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { allLocales } from "../../../services/localization";

  const { StringTableLocale } = window.S4TK.enums;
  const { fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  let uuid: string = uuidv4();
  let projectName = "";
  let group = 0;
  let sourceLanguage = StringTableLocale.English;
  let instanceBase = fnv64(uuid) & 0xffffffffffffffn;

  $: groupString = formatAsHexString(group, 8, false);
  $: instanceBaseString = formatAsHexString(instanceBase, 14, false);
</script>

<div class="project-creation-view">
  <h2 class="my-0">
    <span class="default-gradient-text">New Project</span>
  </h2>
  <p class="mt-1 mb-0 subtle-text">UUID: {uuid}</p>
  <form>
    <input
      class="tgi-input"
      type="text"
      placeholder="Group..."
      bind:value={groupString}
    />
    <input
      class="tgi-input"
      type="text"
      placeholder="Instance Base..."
      bind:value={instanceBaseString}
    />
    <label for="primary-locale-select">Primary Locale</label>
    <select name="primary-locale-select" id="primary-locale-select">
      {#each allLocales as localeData, key (key)}
        <option value={localeData.enumValue}>
          {localeData.englishName}
          {#if localeData.enumValue !== StringTableLocale.English}
            ({localeData.nativeName})
          {/if}
        </option>
      {/each}
    </select>
  </form>
</div>

<style lang="scss">
  .project-creation-view {
    .tgi-input,
    .tgi-input::placeholder {
      font-family: monospace;
    }
  }
</style>
