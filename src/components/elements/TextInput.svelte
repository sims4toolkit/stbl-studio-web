<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { Settings } from "../../typescript/storage";

  interface InputValidator {
    test: (value: string) => boolean;
    error: string;
  }

  export let label: string = undefined;
  export let name: string;
  export let placeholder: string;
  export let monospace = false;
  export let value: string = "";
  export let validators: InputValidator[] = [];
  export let warnings: InputValidator[] = [];
  export let isValid: boolean = true;
  export let fillWidth = false;
  export let focusOnMount = false;
  export let subtleBorder = false;

  let input: HTMLInputElement;
  let errorMessage: string;
  let warningMessage: string;

  $: isWarning = Boolean(warningMessage);

  onMount(() => {
    if (focusOnMount) input.focus();
  });

  $: {
    let i = 0;

    for (i = 0; i < validators.length; i++) {
      const validator = validators[i];

      if (!validator.test(value)) {
        isValid = false;
        errorMessage = validator.error;
        break;
      }
    }

    if (i === validators.length) isValid = true;
  }

  $: {
    if (isValid) {
      let i = 0;

      for (i = 0; i < warnings.length; i++) {
        const validator = warnings[i];

        if (!validator.test(value)) {
          warningMessage = validator.error;
          break;
        }
      }

      if (i === warnings.length) warningMessage = null;
    }
  }
</script>

<div class="text-input" class:w-100={fillWidth}>
  {#if Boolean(label)}
    <div class="flex-center-v">
      <label class="small-title" for={name}>{label}</label>
      {#if !isValid || isWarning}
        <p
          in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
          class="subtle-text my-0 ml-half"
          class:error-color={!isValid}
          class:warning-color={isValid}
        >
          • {warningMessage ?? errorMessage}
        </p>
      {/if}
    </div>
  {/if}
  <input
    bind:this={input}
    id={name}
    {name}
    type="text"
    class:monospace
    class:w-100={fillWidth}
    class:mt-half={Boolean(label)}
    class:subtle-border-color={subtleBorder}
    bind:value
    {placeholder}
    autocomplete="off"
    class:invalid={!isValid}
    class:warning={isWarning}
  />
</div>

<style lang="scss">
  .text-input {
    input {
      height: 42px;
      border-color: var(--color-text);

      &.invalid {
        border-color: var(--color-error);
      }

      &.warning {
        border-color: var(--color-warning);
      }
    }

    input,
    label {
      display: block;
    }
  }
</style>
