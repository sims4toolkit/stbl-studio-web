<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import Switch from "../elements/Switch.svelte";
  const { hashing, formatting, enums } = window.S4TK;

  export let onClose: () => void;

  let value: string = "";
  let useHighBit = false;
  let removeLocaleCode = false;
  let usePrefix = false;

  $: hash32 = hashing.fnv32(value, useHighBit);
  $: hash32hex = formatting.formatAsHexString(hash32, 8, usePrefix);

  $: bit64digits = removeLocaleCode ? 14 : 16;
  $: hash64raw = hashing.fnv64(value, useHighBit);
  $: hash64 = removeLocaleCode
    ? enums.StringTableLocale.getInstanceBase(hash64raw)
    : hash64raw;
  $: hash64hex = formatting.formatAsHexString(hash64, bit64digits, usePrefix);
</script>

<MovableWindow title="Hasher" {onClose}>
  <div class="flex-1 flex flex-col justify-between">
    <TextInput
      label="Enter text to hash"
      name="hasher-input"
      placeholder="Something..."
      bind:value
      fillWidth={true}
    />
    <div class="flex flex-col gap-2">
      <div>
        <p class="text-sm text-subtle uppercase font-bold">32-bit</p>
        <div class="flex justify-between items-center">
          <p class="text-xs">Decimal</p>
          <p class="monospace">{hash32}</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-xs">Hexadecimal</p>
          <p class="monospace">{hash32hex}</p>
        </div>
      </div>
      <div>
        <p class="text-sm text-subtle uppercase font-bold">64-bit</p>
        <div class="flex justify-between items-center">
          <p class="text-xs">Decimal</p>
          <p class="monospace">{hash64}</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-xs">Hexadecimal</p>
          <p class="monospace">{hash64hex}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <Switch label="Force high bit" bind:checked={useHighBit} />
      <Switch
        label="Remove locale from 64-bit"
        bind:checked={removeLocaleCode}
      />
      <Switch label="Use hex prefix" bind:checked={usePrefix} />
    </div>
  </div>
</MovableWindow>
