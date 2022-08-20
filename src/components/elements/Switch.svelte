<script lang="ts">
  export let label: string;
  export let checked: boolean;
</script>

<div class="w-full flex items-center justify-between">
  <p class="text-sm mr-4">{label}</p>
  <label class="switch relative inline-block">
    <input bind:checked type="checkbox" class="opacity-0 w-0 h-0" />
    <span
      class="slider absolute top-0 right-0 bottom-0 left-0 cursor-pointer"
    />
  </label>
</div>

<style lang="scss">
  @use "sass:math";

  .switch {
    $duration: 250ms;
    $width: 30px;
    $height: 16px;
    $slider-width: 14px;

    width: $width;
    height: $height;

    input {
      &:checked + .slider {
        background-color: var(--color-accent-secondary);
      }

      &:focus + .slider::before {
        box-shadow: 0 0 4px black;
      }

      &:checked + .slider::before {
        -webkit-transform: translateX($slider-width);
        -ms-transform: translateX($slider-width);
        transform: translateX($slider-width);
      }
    }

    .slider {
      background-color: var(--color-text-subtle);
      -webkit-transition: $duration;
      transition: $duration;
      border-radius: $height;

      &::before {
        $offset: math.div($height - $slider-width, 2);

        position: absolute;
        content: "";
        height: $slider-width;
        width: $slider-width;
        left: $offset;
        bottom: $offset;
        background-color: var(--color-bg);
        -webkit-transition: $duration;
        transition: $duration;
        border-radius: 50%;
      }
    }
  }
</style>
