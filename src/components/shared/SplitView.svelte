<script lang="ts">
  export let centerV = true;
  export let useGap = true;
  export let reverseOnCollapse = false;
</script>

<div
  class="split-view flex-space-between w-100"
  class:flex-center-v={centerV}
  class:use-gap={useGap}
  class:reverse-on-collapse={reverseOnCollapse}
>
  <div class="left">
    <slot name="left" />
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style lang="scss">
  .split-view {
    max-width: 100%;

    &.use-gap {
      gap: 20px;
    }
  }

  @media only screen and (max-width: 768px) {
    .split-view {
      flex-direction: column;
      justify-content: center;

      &.reverse-on-collapse {
        flex-direction: column-reverse;
      }
    }
  }
</style>
