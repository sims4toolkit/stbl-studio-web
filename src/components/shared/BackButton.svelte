<script lang="ts">
  import { link } from "svelte-spa-router";

  export let href = "/";
</script>

<a class="back-button flex-center-v" {href} use:link>
  <img class="is-svg" src="./assets/chevron-left.svg" alt="<" />
  <p class="my-0">Back</p>
</a>

<style lang="scss">
  .back-button {
    max-width: 80px;
    text-decoration: none;
    white-space: nowrap;
    color: var(--color-text);
    opacity: 0.65;

    &:hover {
      opacity: 1;
    }
  }
</style>
