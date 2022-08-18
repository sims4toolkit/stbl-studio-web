<script lang="ts">
  export let label: string;
  export let fillAndCenter = false;

  // only need one or the other, not both
  export let checked: boolean = undefined;
  export let checkable: {
    checked: boolean;
  } = undefined;
</script>

<div
  class="flex whitespace-nowrap"
  class:w-full={fillAndCenter}
  class:items-center={fillAndCenter}
>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="hover:cursor-pointer">
    {#if checkable}
      <input
        class="hover:cursor-pointer"
        type="checkbox"
        bind:checked={checkable.checked}
      />
    {:else}
      <input class="hover:cursor-pointer" type="checkbox" bind:checked />
    {/if}
    {label}
  </label>
</div>
