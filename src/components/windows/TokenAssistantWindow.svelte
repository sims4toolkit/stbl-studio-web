<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";

  export let onClose: () => void;

  let value: string = "";
</script>

<MovableWindow title="Token Assistant" {onClose}>
  <div class="flex flex-col gap-4">
    <div>
      <p>TODO</p>
    </div>
  </div>
</MovableWindow>
