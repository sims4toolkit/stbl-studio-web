<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";

  export let onClose: () => void;
</script>

<MovableWindow title="Settings" {onClose}>
  <p>Settings</p>
</MovableWindow>
