<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import {
    allLocales,
    getDisplayName,
    getLocaleData,
  } from "../../../typescript/helpers/localization";
  import Select from "../elements/Select.svelte";

  export let name: string;
  export let label: string;
  export let selectedLocale: StringTableLocale;
  export let fillWidth: boolean = false;
  export let include: number[] = undefined;
  export let exclude: number[] = undefined;

  let localeOptions: { value: number; text: string }[];

  $: {
    const base = include ?? allLocales.map(({ enumValue }) => enumValue);

    const filtered = exclude
      ? base.filter((locale) => !exclude.includes(locale))
      : base;

    localeOptions = filtered.map((locale) => {
      return {
        value: locale,
        text: getDisplayName(getLocaleData(locale)),
      };
    });
  }
</script>

<Select
  {name}
  {label}
  {fillWidth}
  bind:selected={selectedLocale}
  options={localeOptions}
/>

<style lang="scss">
  // intentionally blank
</style>
