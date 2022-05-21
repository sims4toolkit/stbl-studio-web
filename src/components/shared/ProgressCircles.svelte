<script lang="ts">
  export let circles: number;
  export let filled: number;

  $: circleArray = Array(circles);
</script>

<div class="progress-circles">
  {#each circleArray as _, key (key)}
    <div class="circle" class:filled={key < filled} />
  {/each}
</div>

<style lang="scss">
  .progress-circles {
    display: flex;

    .circle {
      width: 20px;
      height: 20px;
      border: 1px solid var(--color-text);
      border-radius: 50%;

      &.filled {
        background-color: var(--color-accent);
        border-color: var(--color-accent);
      }

      &:not(:last-child) {
        margin-right: 6px;
      }
    }
  }
</style>
