<script lang="ts">
  export let text: string;
  export let color: string;
  export let link: string;
</script>

<a
  class="hollow-button text-center"
  style="--button-color: {color}"
  href={link}
  target="_blank"
>
  {text}
</a>

<style lang="scss">
  a.hollow-button {
    background-color: transparent;
    border: 1px solid var(--button-color);
    border-radius: 0.5em;
    color: var(--text-color);
    text-decoration: none;
    padding: 0.2em 0.5em;
    min-width: 100px;
    margin: 0.2em;

    &:hover {
      background-color: var(--button-color);
      color: white;
    }
  }
</style>
