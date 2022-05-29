<script lang="ts">
  // intentionally blank
</script>

<div class="pagination flex">
  <button class="button-wrapper">1</button>
  <p>...</p>
  <button class="button-wrapper">4</button>
  <input type="number" placeholder="#" value="5" />
  <button class="button-wrapper">6</button>
  <p>...</p>
  <button class="button-wrapper">10</button>
</div>

<style lang="scss">
  .pagination {
    position: fixed;
    left: 25px;
    bottom: 25px;

    input {
      height: 35px;
    }
  }
</style>
