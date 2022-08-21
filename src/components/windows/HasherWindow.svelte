<script lang="ts">
  import MovableWindow from "src/components/layouts/MovableWindow.svelte";
  import TextInput from "src/components/elements/TextInput.svelte";
  const { fnv32, fnv64 } = window.S4TK.hashing;

  export let onClose: () => void;

  let value: string = "";
</script>

<MovableWindow title="Hasher" {onClose}>
  <div class="flex flex-col gap-4">
    <div>
      <TextInput
        label="Text to hash"
        name="hasher-input"
        placeholder="Text to hash"
        bind:value
        fillWidth={true}
      />
    </div>
  </div>
</MovableWindow>
