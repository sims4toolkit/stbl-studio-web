<script lang="ts">
  export let banded: boolean = false;
</script>

<div class="content-area-wrapper flex-center" class:banded>
  <div class="content-area">
    <slot />
  </div>
</div>

<style lang="scss">
  .content-area-wrapper {
    width: 100%;
    padding: 3em 1em;

    &.banded {
      background-color: var(--color-bg-secondary);
    }

    $breakpoint: 1024px;

    @media only screen and (max-width: $breakpoint) {
      .content-area {
        width: 100%;
      }
    }

    @media only screen and (min-width: $breakpoint) {
      .content-area {
        width: $breakpoint;
      }
    }
  }
</style>
