<script lang="ts">
  import Settings from "src/lib/services/settings";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let label: string = "";
  export let name: string;
  export let value: string;
  export let placeholder: string;
  export let isValid = true;
  export let hasWarning = false;
  export let fillWidth = false;
  export let focusOnMount = false;
  export let monospace = false;
  export let validators: {
    test: (value: string) => boolean;
    isWarning?: boolean;
    message: string;
  }[] = [];

  let input: HTMLInputElement;
  let invalidMessage = "";

  $: {
    value;
    runValidators();
  }

  function runValidators() {
    checkErrors();
    if (isValid) checkWarnings();
  }

  function checkErrors() {
    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i];
      if (validator.isWarning) continue;
      if (!validator.test(value)) {
        isValid = false;
        invalidMessage = validator.message;
        return;
      }
    }

    isValid = true;
  }

  function checkWarnings() {
    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i];
      if (!validator.isWarning) continue;
      if (!validator.test(value)) {
        hasWarning = true;
        invalidMessage = validator.message;
        return;
      }
    }

    hasWarning = false;
  }

  onMount(() => {
    if (focusOnMount) input.focus();
  });
</script>

<div class:w-full={fillWidth}>
  {#if Boolean(label)}
    <div class="flex items-center">
      <label class="text-subtle uppercase text-xs font-bold" for={name}
        >{label}</label
      >
      {#if !isValid}
        <p
          in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
          class="my-0 ml-1 text-xs text-red-600 dark:text-red-400"
        >
          • {invalidMessage}
        </p>
      {:else if hasWarning}
        <p
          in:fade={{ duration: Settings.reduceMotion ? 0 : 500 }}
          class="my-0 ml-1 text-xs text-yellow-600 dark:text-yellow-400"
        >
          • {invalidMessage}
        </p>
      {/if}
    </div>
  {/if}
  <input
    bind:this={input}
    {name}
    bind:value
    {placeholder}
    type="text"
    autocomplete="off"
    class="block h-10 px-2 rounded text-sm placeholder-gray-500 dark:placeholder-gray-500 bg-transparent border border-gray-600 dark:border-gray-400"
    class:monospace
    class:mt-2={Boolean(label)}
    class:w-full={fillWidth}
    class:!border-yellow-600={hasWarning}
    class:!dark:border-yellow-400={hasWarning}
    class:!border-red-600={!isValid}
    class:!dark:border-red-400={!isValid}
  />
</div>
