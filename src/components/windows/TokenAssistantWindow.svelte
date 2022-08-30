<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";

  export let onClose: () => void;

  let tokenIndex = 0;
  let maleValue = "";
  let femaleValue = "";

  $: maleFemalePreview = `{M${tokenIndex}.${maleValue}}{F${tokenIndex}.${femaleValue}}`;

  function copy(string: string) {
    // TODO:
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
        class="w-full block h-10 px-2 rounded text-sm placeholder-gray-500 dark:placeholder-gray-500 bg-transparent border"
        placeholder="#"
      />
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
        class="monospace hover:text-accent-primary-light dark:hover:text-accent-primary-dark text-left text-sm mt-2"
        on:click={() => copy(maleFemalePreview)}>{maleFemalePreview}</button
      >
      <p class="text-xs text-subtle mt-1">Click to copy.</p>
    </div>
  </div>
</MovableWindow>
