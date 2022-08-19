<script lang="ts">
  export let key: string;
  export let string: string;

  let showCopiedConfirmation = false;

  function handleMouseLeave(event: MouseEvent) {
    (event.target as HTMLButtonElement).blur();
  }

  function handleBlur() {
    showCopiedConfirmation = false;
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text.replace(/\r?\n|\r/g, "\\n"));
    showCopiedConfirmation = true;
  }

  const copyKey = () => copy(key);
  const copyText = () => copy(string);
  const copyXml = () => copy(`${key}<!--${string}-->`);
</script>

<button
  on:click={copyKey}
  on:mouseleave={handleMouseLeave}
  on:blur={handleBlur}
>
  <img class="svg h-4" src="./assets/key-outline.svg" alt="Key" />
  <div>
    {showCopiedConfirmation ? "Copied!" : "Copy Key"}
  </div>
</button>
<button
  on:click={copyText}
  on:mouseleave={handleMouseLeave}
  on:blur={handleBlur}
>
  <img class="svg h-4" src="./assets/text-outline.svg" alt="Text" />
  <div class="-left-8">
    {showCopiedConfirmation ? "Copied!" : "Copy Text"}
  </div>
</button>
<button
  on:click={copyXml}
  on:mouseleave={handleMouseLeave}
  on:blur={handleBlur}
>
  <img class="svg h-4" src="./assets/code-outline.svg" alt="Code" />
  <div class="-left-16">
    {showCopiedConfirmation ? "Copied!" : "Copy XML"}
  </div>
</button>

<style lang="scss">
  button {
    position: relative;

    & > div {
      display: none;
      position: absolute;
      top: -2rem;
      white-space: nowrap;
      background-color: var(--color-shadow);
      text-align: center;
      border-radius: 4px;
      width: 5rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }

    &:hover > div,
    &:focus > div {
      display: block;
    }
  }
</style>
