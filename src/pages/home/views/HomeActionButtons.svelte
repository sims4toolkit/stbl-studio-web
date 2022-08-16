<script lang="ts">
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let numSelected: number;

  const ifNotInModal = (fn: () => void) => {
    return () => {
      if (!inModal) fn();
    };
  };

  $: buttonData = inSelectMode
    ? [
        {
          color: "#3F9BCC",
          title: "Download",
          icon: "download",
          keybinding: "s",
          onClick: ifNotInModal(() => {
            console.log("download");
          }),
        },
        {
          color: "#BC47B7",
          title: "Merge",
          icon: "git-merge",
          keybinding: "m",
          disabled: numSelected < 2,
          onClick: ifNotInModal(() => {
            console.log("merge");
          }),
        },
        {
          color: "#D35454",
          title: "Delete",
          icon: "trash",
          keybinding: "d",
          disabled: numSelected < 1,
          onClick: ifNotInModal(() => {
            console.log("delete");
          }),
        },
      ]
    : [
        {
          color: "#305EBA",
          title: "Save Workspace",
          icon: "desktop-download",
          keybinding: "s",
          onClick: ifNotInModal(() => {
            console.log("save");
          }),
        },
        {
          color: "#6B5AC6",
          title: "Upload Project",
          icon: "upload",
          keybinding: "u",
          onClick: ifNotInModal(() => {
            console.log("upload");
          }),
        },
        {
          color: "#48AD6F",
          title: "New Project",
          icon: "plus",
          keybinding: "d",
          onClick: ifNotInModal(() => {
            console.log("create");
          }),
        },
      ];
</script>

<FloatingActionButtonGroup {buttonData} />
