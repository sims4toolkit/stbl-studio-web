<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import DocumentUtils from "src/lib/utilities/document";

  export let onClose: () => void;
</script>

<MovableWindow title="Help" {onClose}>
  <p>Help</p>
  <!-- FIXME: temporary easter egg trigger -->
  <button
    class="border border-black dark:border-white p-2 rounded"
    on:click={() => DocumentUtils.toggleHackerTheme()}
    >Toggle Hacker Mode</button
  >
</MovableWindow>
