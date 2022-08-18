<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";

  export let onClose: () => void;
</script>

<MovableWindow title="Help" {onClose}>
  <p>Help</p>
</MovableWindow>
