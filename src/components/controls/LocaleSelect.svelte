<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import Select from "src/components/elements/Select.svelte";
  import { getDisplayName } from "src/lib/utilities/localization";
  const { enums } = window.S4TK;

  export let label = "locale";
  export let fillWidth = false;
  export let alignRight = false;
  export let selected: StringTableLocale;
  export let localesToChoose = enums.StringTableLocale.all();

  const options = localesToChoose.map((locale) => {
    return {
      value: locale,
      text: getDisplayName(locale),
    };
  });
</script>

<Select
  {label}
  {fillWidth}
  {alignRight}
  bind:selected
  name="locale-select"
  {options}
/>
