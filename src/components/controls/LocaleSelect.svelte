<script lang="ts">
  import type { StringTableLocale } from "@s4tk/models/enums";
  import Select from "src/components/elements/Select.svelte";
  import { getDisplayName } from "src/lib/utilities/localization";
  const { enums } = window.S4TK;

  export let label = "locale";
  export let fillWidth = false;
  export let selected: StringTableLocale;

  const options = enums.StringTableLocale.all().map((locale) => {
    return {
      value: locale,
      text: getDisplayName(locale),
    };
  });
</script>

<Select {label} {fillWidth} bind:selected name="locale-select" {options} />
