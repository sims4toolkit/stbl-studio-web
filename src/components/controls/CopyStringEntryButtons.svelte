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

<div class="flex gap-3 min-w-fit">
  <button
    on:click={copyKey}
    on:mouseleave={handleMouseLeave}
    on:blur={handleBlur}
  >
    <img class="svg h-4" src="./assets/key-outline.svg" alt="Key" />
    <div class="bg-gray-300 dark:bg-gray-900 hacker-border-gray">
      {showCopiedConfirmation ? "Copied!" : "Copy Key"}
    </div>
  </button>
  <button
    on:click={copyText}
    on:mouseleave={handleMouseLeave}
    on:blur={handleBlur}
  >
    <img class="svg h-4" src="./assets/text-outline.svg" alt="Text" />
    <div class="bg-gray-300 dark:bg-gray-900 hacker-border-gray">
      {showCopiedConfirmation ? "Copied!" : "Copy Text"}
    </div>
  </button>
  <button
    on:click={copyXml}
    on:mouseleave={handleMouseLeave}
    on:blur={handleBlur}
  >
    <img class="svg h-4" src="./assets/code-outline.svg" alt="Code" />
    <div class="bg-gray-300 dark:bg-gray-900 hacker-border-gray">
      {showCopiedConfirmation ? "Copied!" : "Copy XML"}
    </div>
  </button>
</div>

<style lang="scss">
  button {
    position: relative;

    & > div {
      display: none;
      position: absolute;
      top: -2rem;
      left: -2.5rem;
      width: 6rem;
      white-space: nowrap;
      opacity: 0.85;
      text-align: center;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }

    &:hover > div,
    &:focus > div {
      display: block;
    }
  }
</style>
