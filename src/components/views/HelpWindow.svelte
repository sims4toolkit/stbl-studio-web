<script lang="ts">
  import Settings from "src/lib/services/settings";
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import Switch from "src/components/elements/Switch.svelte";

  export let onClose: () => void;
</script>

<MovableWindow title="Help" {onClose}>
  <!-- FIXME: temporary easter egg trigger -->
  <div>
    <h4 class="uppercase font-bold text-sm mb-2">
      How do I hack the mainframe?
    </h4>
    <p class="text-subtle text-xs mb-4">
      Contrary to popular belief, hacking the mainframe is actually quite
      simple. Just turn on the following toggle.
    </p>
    <Switch
      label="Hack the Mainframe"
      bind:checked={Settings.mainframeHacked}
    />
  </div>
</MovableWindow>
