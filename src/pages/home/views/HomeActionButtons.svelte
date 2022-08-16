<script lang="ts">
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let numSelected: number;
</script>

<FloatingActionButtonGroup
  buttonData={[
    {
      color: "#ff0000",
      title: "First",
      disabled: true,
      icon: "plus",
      onClick: () => {
        console.log("click");
      },
    },
    {
      color: "#00ff00",
      title: "Second",
      icon: "download",
      onClick: () => {
        console.log("click");
      },
    },
    {
      color: "#0000ff",
      title: "Third",
      icon: "git-merge",
      onClick: () => {
        console.log("click");
      },
    },
  ]}
/>
