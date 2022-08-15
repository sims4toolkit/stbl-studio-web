<script lang="ts">
  export let title: string;
</script>

<div class="text-left inline-block">
  <h3 class="mt-0 mb-2 whitespace-nowrap font-bold text-xl">{title}</h3>
  <hr
    class="bg-accent-primary-light dark:bg-accent-primary-dark m-0 border-none"
  />
</div>

<style lang="scss">
  hr {
    height: 2px;
    border-radius: 2px;
    width: 85%;
  }
</style>
