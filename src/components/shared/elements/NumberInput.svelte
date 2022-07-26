<script lang="ts">
  export let label: string = undefined;
  export let name: string;
  export let placeholder: string = "#";
  export let value: number;
  export let fillWidth = false;
  export let subtleBorder = false;
  export let min: number = undefined;
  export let max: number = undefined;
  export let onBlur: () => void = () => {};
</script>

<div class="number-input" class:w-100={fillWidth}>
  {#if Boolean(label)}
    <div class="flex-center-v">
      <label class="small-title" for={name}>{label}</label>
    </div>
  {/if}
  <input
    id={name}
    {name}
    type="number"
    class:w-100={fillWidth}
    class:mt-half={Boolean(label)}
    class:subtle-border-color={subtleBorder}
    bind:value
    {placeholder}
    autocomplete="off"
    {min}
    {max}
    on:blur={onBlur}
  />
</div>

<style lang="scss">
  .number-input {
    input {
      height: 42px;
      border-color: var(--color-text);
    }

    input,
    label {
      display: block;
    }
  }
</style>
