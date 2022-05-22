<script lang="ts">
  import { fade } from "svelte/transition";

  export let onClick: () => void;
</script>

<button class="button-wrapper" on:click={onClick} transition:fade>
  <img class="is-svg" src="./assets/x.svg" alt="X" />
</button>

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
