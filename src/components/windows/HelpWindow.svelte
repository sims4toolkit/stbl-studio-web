<script lang="ts">
  import Settings from "src/lib/services/settings";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";

  export let onClose: () => void;
</script>

<MovableWindow title="Help" {onClose}>
  <!-- FIXME: temporary easter egg trigger -->
  <div class="flex flex-col gap-4">
    <div>
      <p>Found {Settings.foundEasterEggs.length} of 4 easter eggs.</p>
    </div>
  </div>
</MovableWindow>
