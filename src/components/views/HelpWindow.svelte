<script lang="ts">
  import Settings from "src/lib/services/settings";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Switch from "src/components/elements/Switch.svelte";

  export let onClose: () => void;
</script>

<MovableWindow title="Help" {onClose}>
  <!-- FIXME: temporary easter egg trigger -->
  <div class="flex flex-col gap-4">
    <div>
      <Switch
        label="Hack the Mainframe"
        bind:checked={Settings.mainframeHacked}
      />
      <p class="text-subtle text-xs mt-2">
        Contrary to popular belief, hacking the mainframe is actually quite
        simple. Just turn on the toggle.
      </p>
    </div>
  </div>
</MovableWindow>
