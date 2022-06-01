<script lang="ts">
  import FloatingActionButton from "./FloatingActionButton.svelte";
  import FloatingActionButtonTitle from "./FloatingActionButtonTitle.svelte";

  export let disabled = false;
  export let disabledTitle = "disabled";
  export let buttonData: {
    color: string;
    title: string;
    icon: string;
    disabled?: boolean;
    disabledTitle?: string;
    keybinding?: string;
    onClick(): void;
  }[];

  let titleText: string;
  let titleColor: string;
  $: showTitle = Boolean(titleText);

  function toggleTitle(text?: string, color?: string) {
    titleText = text;
    titleColor = color;
  }
</script>

<div class="floating-action-buttons">
  {#if showTitle}
    <FloatingActionButtonTitle text={titleText} bgColor={titleColor} />
  {/if}
  <div class="flex">
    {#each buttonData as data, key (key)}
      <FloatingActionButton
        color={data.color}
        title={data.title}
        icon={data.icon}
        handleClick={data.onClick}
        keybinding={data.keybinding}
        disabled={disabled || data.disabled}
        disabledTitle={data.disabledTitle ?? disabledTitle}
        {toggleTitle}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .floating-action-buttons {
    position: fixed;
    bottom: 25px;
    right: 25px;
  }
</style>
