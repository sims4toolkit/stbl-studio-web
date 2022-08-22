<script lang="ts">
  import Settings from "src/lib/services/settings";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let label: string = "";
  export let name: string;
  export let value: string;
  export let placeholder: string;
  export let isValid = true;
  export let fillWidth = false;
  export let focusOnMount = false;
  export let monospace = false;
  export let validators: {
    test: (value: string) => boolean;
    message: string;
  }[] = [];

  let input: HTMLInputElement;
  let invalidMessage = "";

  $: {
    value;
    runValidators();
  }

  function runValidators() {
    for (let i = 0; i < validators.length; ++i) {
      const { test, message } = validators[i];
      if (!test(value)) {
        isValid = false;
        invalidMessage = message;
        return;
      }
    }

    isValid = true;
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
    class="block h-10 px-2 rounded text-sm placeholder-gray-500 dark:placeholder-gray-500 bg-transparent border"
    class:monospace
    class:mt-2={Boolean(label)}
    class:w-full={fillWidth}
    class:border-gray-700={isValid}
    class:dark:border-gray-300={isValid}
    class:border-red-600={!isValid}
    class:dark:border-red-400={!isValid}
  />
</div>
