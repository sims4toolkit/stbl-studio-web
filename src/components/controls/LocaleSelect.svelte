<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import Select from "src/components/elements/Select.svelte";
  import { getDisplayName } from "src/lib/utilities/localization";
  const { enums } = window.S4TK;

  export let label: string = null;
  export let fillWidth = false;
  export let alignRight = false;
  export let selected: StringTableLocale;
  export let localesToChoose = enums.StringTableLocale.all();

  $: options = localesToChoose
    .map((locale) => {
      return {
        value: locale,
        text: getDisplayName(locale),
      };
    })
    .sort((a, b) => {
      const aText = a.text.toLowerCase();
      const bText = b.text.toLowerCase();
      if (aText < bText) return -1;
      if (aText > bText) return 1;
      return 0;
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
