<script lang="ts">
  import tokenData from "src/data/tokens.json";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  import Select from "src/components/elements/Select.svelte";

  export let onClose: () => void;

  let hintTimeout: any;
  let hintPara: HTMLParagraphElement;

  let tokenIndex = 0;
  let maleValue = "";
  let femaleValue = "";

  let chosenToken = 0;
  let tokenOptionIndex = 0;
  const tokenMap = new Map<number, string>();
  const tokenOptions = tokenData.tokens.map(({ name, tokens }) => {
    return {
      name,
      options: tokens.map((text) => {
        const value = tokenOptionIndex++;
        const hint = tokenData.tokenHints[text];
        const textWithHint = hint ? `${text} (${hint})` : text;
        tokenMap.set(value, text);
        return { value, text: textWithHint };
      }),
    };
  });

  let chosenSuffix = 0;
  const tokenSuffixOptions = [
    {
      value: 0,
      text: "None",
    },
    ...tokenData.suffixes.map((suffix, i) => ({
      value: i + 1,
      text: suffix,
    })),
  ];

  $: maleFemalePreview = `{M${tokenIndex}.${maleValue}}{F${tokenIndex}.${femaleValue}}`;
  $: premadeTokenOutput = `{${tokenIndex}.${tokenMap.get(chosenToken)}${
    chosenSuffix === 0 ? "" : "|" + tokenSuffixOptions[chosenSuffix].text
  }}`;

  function copyText(event: MouseEvent) {
    const btn = event.target as HTMLButtonElement;
    navigator.clipboard.writeText(btn.innerText);
    hintPara.innerText = "Copied!";
    if (hintTimeout) clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      hintPara.innerText = "Click any output token to copy.";
      hintTimeout = undefined;
    }, 1500);
  }
</script>

<MovableWindow title="Token Assistant" {onClose}>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center gap-8">
      <p class="text-sm whitespace-nowrap max-w-min">Token Index:</p>
      <input
        type="number"
        min="0"
        bind:value={tokenIndex}
        class="w-full block h-10 px-2 rounded text-sm placeholder-gray-500 dark:placeholder-gray-500 bg-transparent border border-gray-600 dark:border-gray-400"
        placeholder="#"
      />
    </div>
    <div>
      <div class="flex gap-2 justify-between">
        <Select
          label="Token"
          name="tokens-select"
          fillWidth={true}
          bind:selected={chosenToken}
          optionGroups={tokenOptions}
        />
        <Select
          label="Suffix"
          name="suffixes-select"
          fillWidth={true}
          bind:selected={chosenSuffix}
          options={tokenSuffixOptions}
        />
      </div>
      <button
        class="monospace break-all hover:text-accent-primary-light dark:hover:text-accent-primary-dark hover:hacker-text-green text-left text-sm mt-2"
        on:click={copyText}>{premadeTokenOutput}</button
      >
    </div>
    <div>
      <p class="text-subtle text-xs font-bold uppercase mb-2">
        Male/Female Pair
      </p>
      <div class="flex justify-between gap-2">
        <TextInput
          name="male-token-input"
          placeholder="Male..."
          bind:value={maleValue}
          fillWidth={true}
        />
        <TextInput
          name="female-token-input"
          placeholder="Female..."
          bind:value={femaleValue}
          fillWidth={true}
        />
      </div>
      <button
        class="monospace break-all hover:text-accent-primary-light dark:hover:text-accent-primary-dark hover:hacker-text-green text-left text-sm mt-2"
        on:click={copyText}>{maleFemalePreview}</button
      >
    </div>
    <p bind:this={hintPara} class="text-xs text-subtle mt-1">
      Click any output token to copy.
    </p>
  </div>
</MovableWindow>
