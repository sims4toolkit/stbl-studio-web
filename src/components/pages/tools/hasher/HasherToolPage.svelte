<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import Checkbox from "../../../elements/Checkbox.svelte";
  import TextInput from "../../../elements/TextInput.svelte";
  import ContentArea from "../../../layout/ContentArea.svelte";

  const { fnv32, fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  let userText = "";
  let uuid = "";

  let useUuid = false;
  let highBit = false;
  let use14Digits = false;

  $: textToHash = useUuid ? uuid + userText : userText;
  $: hash32 = fnv32(textToHash);
  $: hash64 = use14Digits
    ? fnv64(textToHash, highBit) & 0xffffffffffffffn
    : fnv64(textToHash, highBit);

  $: {
    if (useUuid) {
      uuid = uuidv4();
    }
  }
</script>

<svelte:head>
  <title>STBL Studio | FNV Hashing</title>
</svelte:head>
<section id="hasher-page">
  <ContentArea>
    <div>
      <p class="small-title">options</p>
      <div class="flex flex-gap">
        <Checkbox label="Use Random UUID" bind:checked={useUuid} />
        <Checkbox label="Force High Bit" bind:checked={highBit} />
        <Checkbox label="Remove Locale Code" bind:checked={use14Digits} />
      </div>
    </div>
    <div class="my-2">
      <TextInput
        bind:value={userText}
        placeholder="Your text here..."
        fillWidth={true}
        label="Enter text to hash"
        name="hasher-user-input"
      />
      <p class="subtle-text mb-0">
        {#if highBit}
          Forcing high bit.
        {:else}
          Not forcing high bit.
        {/if}
        {#if useUuid}
          Using UUID: {uuid}
        {:else}
          Not using a UUID.
        {/if}
      </p>
    </div>
    <div class="flex flex-gap">
      <div>
        <p class="small-title mt-0">32-bit</p>
        <p class="monospace my-0">
          {formatAsHexString(hash32, 8)}
        </p>
      </div>
      <div>
        <p class="small-title mt-0">64-bit</p>
        <p class="monospace my-0">
          {formatAsHexString(hash64, use14Digits ? 14 : 16)}
        </p>
      </div>
    </div>
    <p class="subtle-text mb-0 mt-2">Click once to copy.</p>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
