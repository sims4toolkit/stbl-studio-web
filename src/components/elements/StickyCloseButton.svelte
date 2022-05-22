<script lang="ts">
  import { fade } from "svelte/transition";

  export let onClick: () => void;
</script>

<img
  class="is-svg"
  transition:fade
  on:click={onClick}
  src="./assets/x.svg"
  alt="X"
/>

<style lang="scss">
  img {
    position: fixed;
    z-index: 4096;
    top: 25px;
    right: 25px;
    width: 50px;
    height: 50px;

    &:hover {
      cursor: pointer;
      opacity: 0.65;
    }
  }
</style>
