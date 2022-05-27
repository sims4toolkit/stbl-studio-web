<script lang="ts">
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";

  export let disabledText: string;
  export let disabled: boolean;
  export let isSelecting: boolean;

  const normalModeToolbar = [
    {
      title: "save stbl",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "import strings",
      icon: "upload",
      color: ToolbarColor.Upload,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "new string",
      icon: "plus",
      color: ToolbarColor.Create,
      async onClick() {
        alert("button clicked");
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      async onClick() {
        alert("Merge Clicked");
      },
    },
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      async onClick() {
        alert("Download Clicked");
      },
    },
  ];

  $: buttonData = isSelecting ? selectModeToolbar : normalModeToolbar;
</script>

<FloatingActionButtonGroup {buttonData} {disabled} {disabledText} />

<style lang="scss">
  // intentionally blank
</style>
