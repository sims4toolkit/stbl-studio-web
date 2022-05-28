<script lang="ts">
  import { formatStringKey } from "@s4tk/hashing/formatting";

  export let mode: "view" | "edit" | "select" = "view";
  export let stringEntry: { key: number; value: string };

  let stringInput: HTMLInputElement;

  const enableViewMode = () => (mode = "view");

  function focusIfEditing(e: MouseEvent) {
    setTimeout(() => {
      if (mode === "edit") (e.target as HTMLInputElement).focus();
    }, 50);
  }

  function handleDoubleClick(e: MouseEvent) {
    e.preventDefault();

    if (mode === "view") {
      mode = "edit";
    }
  }

  function pencilClicked() {
    mode = mode === "edit" ? "view" : "edit";
    if (mode === "edit") stringInput.focus();
  }
</script>

<div class="string-entry-cell w-100 flex-center-v flex-gap px-1 py-half">
  {#if mode === "select"}
    <div>hi</div>
  {/if}

  <input
    type="text"
    class="input-height monospace key-input"
    readonly={mode !== "edit"}
    tabindex={mode === "edit" ? 0 : -1}
    placeholder={"0x12345678"}
    value={formatStringKey(stringEntry.key)}
    on:dblclick={handleDoubleClick}
    on:click={focusIfEditing}
    on:blur={enableViewMode}
  />

  <input
    bind:this={stringInput}
    type="text"
    class="input-height w-100"
    readonly={mode !== "edit"}
    tabindex={mode === "edit" ? 0 : -1}
    placeholder={"{0.SimFirstName} is reticulating {0.SimPronounPossessiveDependent} splines!"}
    value={stringEntry.value}
    on:dblclick={handleDoubleClick}
    on:click={focusIfEditing}
    on:blur={enableViewMode}
  />

  <button class="button-wrapper">
    <img src="./assets/copy.svg" alt="Copy" class="is-svg" />
  </button>

  <button class="button-wrapper" on:click={pencilClicked}>
    <img src="./assets/pencil.svg" alt="Edit" class="is-svg" />
  </button>
</div>

<style lang="scss">
  .string-entry-cell {
    $border-radius: 8px;
    background-color: var(--color-bg-secondary);
    user-select: none;

    &:first-child {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    &:not(:first-child) {
      border-top: 1px solid var(--color-bg);
    }

    &:last-child {
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }

    input,
    input:focus {
      border: 1px solid var(--color-divider);
      cursor: text;

      &:read-only {
        border: none;
        outline: none;
      }

      &.key-input {
        width: 105px;
      }
    }

    img {
      height: 18px;
      width: auto;
    }
  }
</style>
