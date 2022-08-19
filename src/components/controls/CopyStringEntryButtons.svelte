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

<div class="flex gap-4">
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
    <div class="second-offset">
      {showCopiedConfirmation ? "Copied!" : "Copy Text"}
    </div>
  </button>
  <button
    on:click={copyXml}
    on:mouseleave={handleMouseLeave}
    on:blur={handleBlur}
  >
    <img class="svg h-4" src="./assets/code-outline.svg" alt="Code" />
    <div class="third-offset">
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
      white-space: nowrap;
      background-color: var(--color-shadow);
      text-align: center;
      border-radius: 4px;
      width: 5rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;

      &.second-offset {
        left: -30px;
      }

      &.third-offset {
        left: -60px;
      }
    }

    &:hover > div,
    &:focus > div {
      display: block;
    }
  }
</style>
