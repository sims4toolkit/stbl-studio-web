<script lang="ts">
  import type { FloatingActionButtonData } from "../../../global";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let numSelected: number;
  export let onAction: (action: HomeAction) => void;

  let buttonData: FloatingActionButtonData[];

  $: disabled = inModal || (inSelectMode && numSelected < 1);

  const normalButtonData: FloatingActionButtonData[] = [
    {
      title: "save workspace (s)",
      icon: "desktop-download",
      color: ToolbarColor.Save,
      keybinding: "s",
      async onClick() {
        onAction("save-workspace");
      },
    },
    {
      title: "upload files (u)",
      icon: "upload",
      color: ToolbarColor.Upload,
      keybinding: "u",
      async onClick() {
        onAction("upload");
      },
    },
    {
      title: "new project (n)",
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
      title: "download (s)",
      icon: "download",
      keybinding: "s",
      color: ToolbarColor.Download,
      async onClick() {
        onAction("download");
      },
    },
    {
      title: "merge (m)",
      icon: "git-merge",
      keybinding: "m",
      color: ToolbarColor.Merge,
      async onClick() {
        onAction("merge");
      },
    },
    {
      title: "delete (d)",
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
