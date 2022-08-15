<script lang="ts">
  import type { FloatingActionButtonData } from "../../../global";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../..//controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let numSelected: number;
  export let onAction: (action: HomeAction) => void;

  let buttonData: FloatingActionButtonData[];

  $: disabled = inModal || (inSelectMode && numSelected < 1);

  const normalButtonData: FloatingActionButtonData[] = [
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Save,
      keybinding: "s",
      async onClick() {
        onAction("save-workspace");
      },
    },
    {
      title: "upload files",
      icon: "upload",
      color: ToolbarColor.Upload,
      keybinding: "u",
      async onClick() {
        onAction("upload");
      },
    },
    {
      title: "new project",
      icon: "plus",
      color: ToolbarColor.Create,
      keybinding: "n",
      async onClick() {
        onAction("create");
      },
    },
  ];

  const selectModeButtonData: FloatingActionButtonData[] = [
    {
      title: "download",
      icon: "download",
      keybinding: "s",
      color: ToolbarColor.Download,
      async onClick() {
        onAction("download");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      keybinding: "m",
      color: ToolbarColor.Merge,
      async onClick() {
        onAction("merge");
      },
    },
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      keybinding: "d",
      async onClick() {
        onAction("delete");
      },
    },
  ];

  const mergeButtonData = selectModeButtonData[1];

  $: {
    inSelectMode;
    numSelected;

    mergeButtonData.disabled = inSelectMode && numSelected < 2;

    buttonData = inSelectMode ? selectModeButtonData : normalButtonData;
  }
</script>

<FloatingActionButtonGroup {buttonData} {disabled} />

<style lang="scss">
  // intentionally blank
</style>
