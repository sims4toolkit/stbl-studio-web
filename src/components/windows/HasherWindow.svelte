<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import Switch from "../elements/Switch.svelte";
  const { hashing, formatting, enums } = window.S4TK;

  export let onClose: () => void;

  let hintTimeout: any;
  let hintPara: HTMLParagraphElement;

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

  function copyText(event: MouseEvent) {
    const btn = event.target as HTMLButtonElement;
    navigator.clipboard.writeText(btn.innerText);
    hintPara.innerText = "Copied!";
    if (hintTimeout) clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      hintPara.innerText = "Click number to copy.";
      hintTimeout = undefined;
    }, 1500);
  }
</script>

<MovableWindow title="Hasher" {onClose}>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <p class="text-subtle text-xs font-bold">ENTER TEXT TO HASH</p>
        <button
          class="text-xs text-accent-secondary-light dark:text-accent-secondary-dark hacker-text-lime underline hover:no-underline"
          on:click={() => (value = "")}>CLEAR</button
        >
      </div>
      <TextInput
        name="hasher-input"
        placeholder="Something..."
        bind:value
        fillWidth={true}
      />
    </div>
    <div class="flex flex-col gap-2">
      <div>
        <p class="text-sm text-subtle uppercase font-bold">32-bit</p>
        <div class="flex justify-between items-center">
          <p class="text-xs">Decimal</p>
          <button
            class="monospace hover:text-accent-primary-light dark:hover:text-accent-primary-dark hover:hacker-text-green"
            on:click={copyText}>{hash32}</button
          >
        </div>
        <div class="flex justify-between items-center">
          <p class="text-xs">Hexadecimal</p>
          <button
            class="monospace hover:text-accent-primary-light dark:hover:text-accent-primary-dark hover:hacker-text-green"
            on:click={copyText}>{hash32hex}</button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-subtle uppercase font-bold">64-bit</p>
        <div class="flex justify-between items-center">
          <p class="text-xs">Decimal</p>
          <button
            class="monospace hover:text-accent-primary-light dark:hover:text-accent-primary-dark hover:hacker-text-green"
            on:click={copyText}>{hash64}</button
          >
        </div>
        <div class="flex justify-between items-center">
          <p class="text-xs">Hexadecimal</p>
          <button
            class="monospace hover:text-accent-primary-light dark:hover:text-accent-primary-dark hover:hacker-text-green"
            on:click={copyText}>{hash64hex}</button
          >
        </div>
      </div>
      <p bind:this={hintPara} class="text-xs text-subtle text-right">
        Click number to copy.
      </p>
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
