<script lang="ts">
  import { formatStringKey } from "@s4tk/hashing/formatting";

  export let mode: "view" | "edit" | "select" = "view";
  export let stringEntry: { key: number; value: string };

  let stringInput: HTMLInputElement;

  const enableViewMode = () => (mode = "view");

  function focusIfEditing(e: MouseEvent) {
    setTimeout(() => {
      if (mode === "edit") {
        (e.target as HTMLInputElement).focus();
      }
    }, 50);
  }

  function handleDoubleClick(e: MouseEvent) {
    e.preventDefault();

    if (mode === "view") {
      mode = "edit";
    }
  }

  $: stringCopyDisabled = mode === "edit";
</script>

<div class="string-entry-cell w-100 flex-center-v flex-gap px-1 py-half">
  {#if mode === "select"}
    <div>hi</div>
  {/if}

  <div class="input-wrapper">
    <button
      class="button-wrapper input-copy-button"
      class:hidden={stringCopyDisabled}
    >
      <img class="is-svg light-svg" src="./assets/copy.svg" alt="Copy" />
    </button>
    <input
      type="text"
      class="input-height monospace key-input accent-color"
      readonly={mode !== "edit"}
      tabindex={mode === "edit" ? 0 : -1}
      placeholder="Key..."
      value={formatStringKey(stringEntry.key)}
      on:dblclick={handleDoubleClick}
      on:click={focusIfEditing}
      on:blur={enableViewMode}
    />
  </div>

  <div class="input-wrapper w-100">
    <button
      class="button-wrapper input-copy-button"
      class:hidden={stringCopyDisabled}
    >
      <img class="is-svg light-svg" src="./assets/copy.svg" alt="Copy" />
    </button>
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
  </div>

  {#if mode === "view"}
    <button class="button-wrapper">
      <img src="./assets/copy.svg" alt="Copy" class="is-svg" />
    </button>
    <button class="button-wrapper">
      <img src="./assets/pencil.svg" alt="Edit" class="is-svg" />
    </button>
  {:else if mode === "edit"}
    <button class="button-wrapper">
      <img src="./assets/save-outline.svg" alt="Copy" class="is-svg" />
    </button>
  {/if}
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
        border-color: var(--color-bg-secondary);
        outline: none;
      }

      &.key-input {
        width: 105px;
      }
    }

    .input-wrapper {
      position: relative;

      &:hover {
        .input-copy-button {
          display: inline-block;
        }
      }

      .input-copy-button {
        display: none;
        background-color: var(--color-divider);
        border-radius: 4px;
        position: absolute;
        top: 8px;
        left: -20px;
        width: 24px;
        height: 24px;

        &.hidden {
          display: none;
        }

        &:hover {
          opacity: 0.65;
        }

        img {
          height: 12px;
          // filter: var(--filter-svg-invert);
        }
      }
    }

    img {
      height: 16px;
      width: auto;
    }
  }
</style>
