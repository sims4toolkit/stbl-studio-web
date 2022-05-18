<script lang="ts">
  // intentionally blank
</script>

<div class="body-content">
  <slot />
</div>

<style lang="scss">
  $breakpoint: 1024px;

  @media only screen and (max-width: $breakpoint) {
    .body-content {
      width: 100%;
      padding: 0 1em;
    }
  }

  @media only screen and (min-width: $breakpoint) {
    .body-content {
      width: $breakpoint;
    }
  }
</style>
