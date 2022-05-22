<script lang="ts">
  import { fade } from "svelte/transition";

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
  export let isValid: boolean = true;
  export let fillWidth = false;

  let errorMessage: string;

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
</script>

<div class="text-input" class:w-100={fillWidth}>
  {#if Boolean(label)}
    <label class="small-title" for={name}>{label}</label>
  {/if}
  <input
    id={name}
    {name}
    type="text"
    class:monospace
    class:w-100={fillWidth}
    class="my-half"
    bind:value
    {placeholder}
    autocomplete="off"
    class:highlight={validators?.length}
    class:valid={isValid}
  />
  {#if !isValid}
    <p in:fade class="subtle-text error-color my-0">
      {errorMessage}
    </p>
  {/if}
</div>

<style lang="scss">
  .text-input {
    input,
    label {
      display: block;
    }

    input.highlight {
      border-color: var(--color-error);

      &.valid {
        border-color: var(--color-text);
      }
    }
  }
</style>
