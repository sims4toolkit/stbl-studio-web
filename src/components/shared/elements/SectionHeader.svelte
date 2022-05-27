<script lang="ts">
  export let title: string;
</script>

<div class="section-header">
  <h3 class="mt-0 mb-half nowrap">{title}</h3>
  <hr />
</div>

<style lang="scss">
  .section-header {
    text-align: left;
    display: inline-block;

    hr {
      background-color: var(--color-accent);
      height: 2px;
      border: 0;
      border-radius: 2px;
      width: 85%;
      margin: 0;
    }
  }
</style>
