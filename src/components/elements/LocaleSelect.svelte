<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import {
    allLocales,
    getDisplayName,
    getLocaleData,
  } from "../../typescript/helpers/localization";
  import Select from "./Select.svelte";

  export let name: string;
  export let label: string;
  export let selectedLocale: StringTableLocale;
  export let fillWidth: boolean = false;

  // only one or the other
  export let include: number[] = undefined;
  export let exclude: number[] = undefined;

  $: localeOptions = include
    ? include.map((enumValue) => {
        return {
          value: enumValue,
          text: getDisplayName(getLocaleData(enumValue)),
        };
      })
    : allLocales
        .filter(({ enumValue }) => !exclude || !exclude.includes(enumValue))
        .map((data) => {
          return {
            value: data.enumValue,
            text: getDisplayName(data),
          };
        });
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
